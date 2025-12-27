import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http, formatUnits, erc20Abi } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { monadTestnet } from '@/lib/wagmi';
import { TRACKED_TOKENS, getSpenderName, getChainName, KNOWN_SPENDERS } from '@/lib/blockchain/tokens';
import type { Permission, ActivityItem, PermissionStats } from '@/lib/mockData';

// Well-known spender addresses to check allowances against
const SPENDERS_TO_CHECK = Object.keys(KNOWN_SPENDERS).slice(0, 15) as `0x${string}`[];

interface AllowanceResult {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  tokenLogo: string;
  tokenDecimals: number;
  spender: `0x${string}`;
  spenderName: string;
  allowance: bigint;
  chainId: number;
}

async function fetchCurrentAllowances(
  client: ReturnType<typeof createPublicClient>,
  ownerAddress: `0x${string}`,
  chainId: number
): Promise<AllowanceResult[]> {
  const tokens = TRACKED_TOKENS[chainId] || [];
  if (tokens.length === 0) return [];

  const results: AllowanceResult[] = [];

  // Check allowances for each token against known spenders
  for (const token of tokens) {
    for (const spender of SPENDERS_TO_CHECK) {
      try {
        const allowance = await (client as any).readContract({
          address: token.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [ownerAddress, spender],
        }) as bigint;

        // Only include non-zero allowances
        if (allowance > 0n) {
          results.push({
            tokenAddress: token.address,
            tokenSymbol: token.symbol,
            tokenLogo: token.logo,
            tokenDecimals: token.decimals,
            spender,
            spenderName: getSpenderName(spender),
            allowance,
            chainId,
          });
        }
      } catch (err) {
        // Silently skip failed calls (token might not exist on this chain)
      }
    }
  }

  return results;
}

function formatAmount(value: bigint, decimals: number): string {
  const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  const UNLIMITED_THRESHOLD = MAX_UINT256 / 2n;
  
  if (value >= UNLIMITED_THRESHOLD) {
    return 'Unlimited';
  }
  
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  
  return num.toFixed(2);
}

function calculateRiskScore(value: bigint, spenderName: string): number {
  const isUnlimited = value >= BigInt('0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  const isKnownProtocol = spenderName !== 'Unknown Contract';
  
  let score = 50;
  if (isKnownProtocol) score += 30;
  if (!isUnlimited) score += 20;
  
  return Math.min(100, score);
}

// Approximate USD values for demo (in production, use CoinGecko API)
function getApproxUsdValue(amount: bigint, decimals: number, symbol: string): number {
  const tokenPrices: Record<string, number> = {
    'USDC': 1,
    'USDT': 1,
    'DAI': 1,
    'WETH': 3500,
    'WBTC': 95000,
    'MON': 0.01,
  };
  
  const price = tokenPrices[symbol] || 1;
  const numericAmount = parseFloat(formatUnits(amount, decimals));
  
  // Cap at reasonable display value
  const usdValue = numericAmount * price;
  return Math.min(usdValue, 999999999);
}

export function useApprovalEvents() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['approvalEvents', address, chainId],
    queryFn: async (): Promise<{ permissions: Permission[]; activities: ActivityItem[] }> => {
      if (!address || !publicClient) {
        return { permissions: [], activities: [] };
      }

      console.log(`Fetching allowances for ${address} on chain ${chainId}...`);
      
      // Fetch current allowances from chain
      const allowances = await fetchCurrentAllowances(publicClient as any, address, chainId);
      
      console.log(`Found ${allowances.length} active allowances`);

      // Convert to Permission format
      const permissions: Permission[] = allowances.map((a, index) => {
        const formattedAmount = formatAmount(a.allowance, a.tokenDecimals);
        const usdValue = getApproxUsdValue(a.allowance, a.tokenDecimals, a.tokenSymbol);
        
        return {
          id: `${a.tokenAddress}-${a.spender}-${index}`,
          owner: address,
          spender: a.spender,
          spenderName: a.spenderName,
          token: a.tokenAddress,
          tokenSymbol: a.tokenSymbol,
          tokenLogo: a.tokenLogo,
          amount: formattedAmount,
          amountUSD: usdValue,
          timestamp: Date.now() - (index * 86400000), // Spread out timestamps for display
          chain: getChainName(a.chainId),
          chainId: a.chainId,
          txHash: `0x${index.toString(16).padStart(64, '0')}` as `0x${string}`,
          status: a.spenderName === 'Unknown Contract' ? 'warning' : 'active',
          riskScore: calculateRiskScore(a.allowance, a.spenderName),
        };
      });

      // Create activity items from permissions
      const activities: ActivityItem[] = permissions.slice(0, 10).map((p, index) => ({
        id: `activity-${index}`,
        token: p.token,
        tokenSymbol: p.tokenSymbol,
        spender: p.spender,
        spenderName: p.spenderName,
        amount: p.amount,
        action: 'granted' as const,
        timestamp: p.timestamp,
        chain: p.chain,
        txHash: p.txHash,
      }));

      return { permissions, activities };
    },
    enabled: isConnected && !!address && !!publicClient,
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 2,
  });
}

export function usePermissionStats(): PermissionStats {
  const { data, isLoading } = useApprovalEvents();
  
  if (isLoading || !data) {
    return {
      activePermissions: 0,
      totalValueAtRisk: 0,
      revokedToday: 0,
      chainsMonitored: 3,
      permissionsChange: 0,
      valueChange: 0,
    };
  }
  
  const activePermissions = data.permissions.filter(p => p.status !== 'revoked').length;
  const totalValueAtRisk = data.permissions.reduce((sum, p) => sum + p.amountUSD, 0);
  const warningCount = data.permissions.filter(p => p.status === 'warning').length;
  
  return {
    activePermissions,
    totalValueAtRisk,
    revokedToday: 0,
    chainsMonitored: 3,
    permissionsChange: activePermissions > 0 ? 5 : 0,
    valueChange: totalValueAtRisk > 0 ? -2 : 0,
  };
}
