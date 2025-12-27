import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Custom Monad chain configuration
export const monadTestnet = {
  id: 41454,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: 'PermissionGuard',
  projectId: 'demo-project-id', // Replace with actual WalletConnect project ID
  chains: [mainnet, sepolia, monadTestnet],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [monadTestnet.id]: http(),
  },
});

export const supportedChains = [
  { id: mainnet.id, name: 'Ethereum', icon: '⟠' },
  { id: sepolia.id, name: 'Sepolia', icon: '⟠' },
  { id: monadTestnet.id, name: 'Monad', icon: '◈' },
];
