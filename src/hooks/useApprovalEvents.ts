import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http, parseAbiItem, formatUnits } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { useAccount, useChainId } from 'wagmi';
import { monadTestnet } from '@/lib/wagmi';
import { TRACKED_TOKENS, getSpenderName, getChainName } from '@/lib/blockchain/tokens';
import type { Permission, ActivityItem } from '@/lib/mockData';

// Create clients for each chain
const clients = {
  1: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  11155111: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
  41454: createPublicClient({
    chain: monadTestnet as any,
    transport: http(),
  }),
};

const approvalEvent = parseAbiItem(
  'event Approval(address indexed owner, address indexed spender, uint256 value)'
);

interface ApprovalLog {
  tokenAddress: `0x${string}`;
  tokenSymbol: string;
  tokenLogo: string;
  tokenDecimals: number;
  spender: `0x${string}`;
  value: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  chainId: number;
}

async function fetchApprovalEvents(
  address: `0x${string}`,
  chainId: number
): Promise<ApprovalLog[]> {
  const client = clients[chainId as keyof typeof clients];
  if (!client) return [];

  const tokens = TRACKED_TOKENS[chainId] || [];
  if (tokens.length === 0) return [];

  const approvals: ApprovalLog[] = [];

  try {
    // Get current block number
    const currentBlock = await client.getBlockNumber();
    // Fetch last 10000 blocks (approximately 1-2 days on Ethereum)
    const fromBlock = currentBlock > 10000n ? currentBlock - 10000n : 0n;

    for (const token of tokens) {
      try {
        const logs = await client.getLogs({
          address: token.address,
          event: approvalEvent,
          args: { owner: address },
          fromBlock,
          toBlock: 'latest',
        });

        for (const log of logs) {
          approvals.push({
            tokenAddress: token.address,
            tokenSymbol: token.symbol,
            tokenLogo: token.logo,
            tokenDecimals: token.decimals,
            spender: log.args.spender as `0x${string}`,
            value: log.args.value as bigint,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
            chainId,
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch logs for ${token.symbol} on chain ${chainId}:`, err);
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch block number for chain ${chainId}:`, err);
  }

  return approvals;
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

export function useApprovalEvents() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  return useQuery({
    queryKey: ['approvalEvents', address, chainId],
    queryFn: async (): Promise<{ permissions: Permission[]; activities: ActivityItem[] }> => {
      if (!address) return { permissions: [], activities: [] };

      // Fetch from current chain
      const logs = await fetchApprovalEvents(address, chainId);
      
      // Deduplicate by spender + token (keep latest)
      const permissionMap = new Map<string, ApprovalLog>();
      
      for (const log of logs) {
        const key = `${log.tokenAddress}-${log.spender}`.toLowerCase();
        const existing = permissionMap.get(key);
        
        if (!existing || log.blockNumber > existing.blockNumber) {
          permissionMap.set(key, log);
        }
      }

      // Convert to Permission format
      const permissions: Permission[] = [];
      const activities: ActivityItem[] = [];

      for (const [, log] of permissionMap) {
        const spenderName = getSpenderName(log.spender);
        const formattedAmount = formatAmount(log.value, log.tokenDecimals);
        const isZero = log.value === 0n;
        
        // Only add non-zero approvals as active permissions
        if (!isZero) {
          permissions.push({
            id: `${log.transactionHash}-${log.spender}`,
            owner: address,
            spender: log.spender,
            spenderName,
            token: log.tokenAddress,
            tokenSymbol: log.tokenSymbol,
            tokenLogo: log.tokenLogo,
            amount: formattedAmount,
            amountUSD: parseFloat(formatUnits(log.value, log.tokenDecimals)) * 1, // Simplified USD calculation
            timestamp: Number(log.blockNumber) * 12000, // Approximate timestamp
            chain: getChainName(log.chainId),
            chainId: log.chainId,
            txHash: log.transactionHash,
            status: spenderName === 'Unknown Contract' ? 'warning' : 'active',
            riskScore: calculateRiskScore(log.value, spenderName),
          });
        }
      }

      // Create activity items from all logs (sorted by block number)
      const sortedLogs = [...logs].sort((a, b) => Number(b.blockNumber - a.blockNumber));
      
      for (const log of sortedLogs.slice(0, 20)) {
        const spenderName = getSpenderName(log.spender);
        const formattedAmount = formatAmount(log.value, log.tokenDecimals);
        const isRevoked = log.value === 0n;
        
        activities.push({
          id: log.transactionHash,
          token: log.tokenAddress,
          tokenSymbol: log.tokenSymbol,
          spender: log.spender,
          spenderName,
          amount: formattedAmount,
          action: isRevoked ? 'revoked' : 'granted',
          timestamp: Number(log.blockNumber) * 12000,
          chain: getChainName(log.chainId),
          txHash: log.transactionHash,
        });
      }

      return { permissions, activities };
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000,
  });
}

export function usePermissionStats() {
  const { data } = useApprovalEvents();
  
  const activePermissions = data?.permissions.filter(p => p.status !== 'revoked').length || 0;
  const totalValueAtRisk = data?.permissions.reduce((sum, p) => sum + p.amountUSD, 0) || 0;
  const warningCount = data?.permissions.filter(p => p.status === 'warning').length || 0;
  
  return {
    activePermissions,
    totalValueAtRisk,
    revokedToday: 0, // Would need more historical data
    chainsMonitored: 3,
    permissionsChange: 0,
    valueChange: 0,
    warningCount,
  };
}
