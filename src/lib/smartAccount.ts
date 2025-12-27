import { createPublicClient, http, type WalletClient, type PublicClient, type Chain } from 'viem';
import { createBundlerClient, type BundlerClient, type SmartAccount } from 'viem/account-abstraction';
import {
  toMetaMaskSmartAccount,
  Implementation,
  getSmartAccountsEnvironment,
  type MetaMaskSmartAccount,
} from '@metamask/smart-accounts-kit';
import { mainnet, sepolia } from 'viem/chains';
import { monadTestnet } from './wagmi';

// Bundler RPC URLs - using public bundlers where available
// For production, replace with your own bundler endpoints (e.g., Pimlico, Stackup, Alchemy)
const BUNDLER_URLS: Record<number, string | undefined> = {
  [mainnet.id]: undefined, // Mainnet requires a paid bundler service
  [sepolia.id]: 'https://public.stackup.sh/api/v1/node/ethereum-sepolia', // Public Sepolia bundler
  [monadTestnet.id]: undefined, // Monad testnet bundler TBD
};

// Chains that support smart accounts (have bundler infrastructure)
export const SMART_ACCOUNT_SUPPORTED_CHAINS = [sepolia.id] as const;

export function isSmartAccountSupported(chainId: number): boolean {
  return SMART_ACCOUNT_SUPPORTED_CHAINS.includes(chainId as typeof SMART_ACCOUNT_SUPPORTED_CHAINS[number]);
}

export async function createSmartAccount(
  walletClient: WalletClient,
  publicClient: PublicClient,
  chain: Chain
): Promise<MetaMaskSmartAccount<Implementation.Hybrid>> {
  const ownerAddress = walletClient.account?.address;
  if (!ownerAddress) {
    throw new Error('Wallet client has no account');
  }

  // Get the smart accounts environment for the chain
  const environment = await getSmartAccountsEnvironment(chain.id);

  // Create a hybrid smart account (most flexible option)
  const smartAccount = await toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [ownerAddress, [], [], []], // Owner address, no WebAuthn keys initially
    deploySalt: '0x0000000000000000000000000000000000000000000000000000000000000000',
    signer: { walletClient },
    environment,
  });

  return smartAccount;
}

export function createSmartAccountBundlerClient(
  publicClient: PublicClient,
  smartAccount: SmartAccount,
  chainId: number
): BundlerClient | null {
  const bundlerUrl = BUNDLER_URLS[chainId];

  if (!bundlerUrl) {
    console.warn(`No bundler URL configured for chain ${chainId}`);
    return null;
  }

  const bundlerClient = createBundlerClient({
    client: publicClient,
    transport: http(bundlerUrl),
    account: smartAccount,
  });

  return bundlerClient;
}

export function getPublicClientForChain(chainId: number): PublicClient {
  const chain = chainId === mainnet.id
    ? mainnet
    : chainId === sepolia.id
      ? sepolia
      : monadTestnet;

  return createPublicClient({
    chain,
    transport: http(),
  });
}
