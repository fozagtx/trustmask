export interface Permission {
  id: string;
  owner: string;
  spender: string;
  spenderName: string;
  token: string;
  tokenSymbol: string;
  tokenLogo: string;
  amount: string;
  amountUSD: number;
  timestamp: number;
  chain: string;
  chainId: number;
  txHash: string;
  status: 'active' | 'revoked' | 'warning';
  riskScore: number;
}

export interface PermissionStats {
  activePermissions: number;
  totalValueAtRisk: number;
  revokedToday: number;
  chainsMonitored: number;
  permissionsChange: number;
  valueChange: number;
}

export interface ActivityItem {
  id: string;
  token: string;
  tokenSymbol: string;
  spender: string;
  spenderName: string;
  amount: string;
  action: 'granted' | 'revoked';
  timestamp: number;
  chain: string;
  txHash: string;
}

export const mockPermissions: Permission[] = [
  {
    id: '1',
    owner: '0x1234...5678',
    spender: '0xdef1...c0de',
    spenderName: 'Uniswap V3',
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    tokenSymbol: 'USDC',
    tokenLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    amount: 'Unlimited',
    amountUSD: 50000,
    timestamp: Date.now() - 86400000 * 5,
    chain: 'Ethereum',
    chainId: 1,
    txHash: '0xabc123...',
    status: 'active',
    riskScore: 85,
  },
  {
    id: '2',
    owner: '0x1234...5678',
    spender: '0x1111...2222',
    spenderName: 'Unknown Contract',
    token: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    tokenSymbol: 'USDT',
    tokenLogo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    amount: '10,000',
    amountUSD: 10000,
    timestamp: Date.now() - 86400000 * 30,
    chain: 'Ethereum',
    chainId: 1,
    txHash: '0xdef456...',
    status: 'warning',
    riskScore: 35,
  },
  {
    id: '3',
    owner: '0x1234...5678',
    spender: '0xbeef...cafe',
    spenderName: 'Aave V3',
    token: '0x6b175474e89094c44da98b954eedeac495271d0f',
    tokenSymbol: 'DAI',
    tokenLogo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    amount: '25,000',
    amountUSD: 25000,
    timestamp: Date.now() - 86400000 * 2,
    chain: 'Ethereum',
    chainId: 1,
    txHash: '0x789ghi...',
    status: 'active',
    riskScore: 92,
  },
  {
    id: '4',
    owner: '0x1234...5678',
    spender: '0xcafe...babe',
    spenderName: 'Curve Finance',
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    tokenSymbol: 'USDC',
    tokenLogo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    amount: '5,000',
    amountUSD: 5000,
    timestamp: Date.now() - 86400000 * 15,
    chain: 'Monad',
    chainId: 41454,
    txHash: '0xjkl012...',
    status: 'active',
    riskScore: 78,
  },
  {
    id: '5',
    owner: '0x1234...5678',
    spender: '0xdead...beef',
    spenderName: 'Old Protocol',
    token: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    tokenSymbol: 'USDT',
    tokenLogo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    amount: '1,000',
    amountUSD: 1000,
    timestamp: Date.now() - 86400000 * 60,
    chain: 'Sepolia',
    chainId: 11155111,
    txHash: '0xmno345...',
    status: 'revoked',
    riskScore: 0,
  },
];

export const mockStats: PermissionStats = {
  activePermissions: 4,
  totalValueAtRisk: 90000,
  revokedToday: 2,
  chainsMonitored: 3,
  permissionsChange: 12,
  valueChange: -5,
};

export const mockActivity: ActivityItem[] = [
  {
    id: '1',
    token: 'USDC',
    tokenSymbol: 'USDC',
    spender: '0xdef1...c0de',
    spenderName: 'Uniswap V3',
    amount: 'Unlimited',
    action: 'granted',
    timestamp: Date.now() - 3600000,
    chain: 'Ethereum',
    txHash: '0xabc123...',
  },
  {
    id: '2',
    token: 'USDT',
    tokenSymbol: 'USDT',
    spender: '0xdead...beef',
    spenderName: 'Old Protocol',
    amount: '1,000',
    action: 'revoked',
    timestamp: Date.now() - 7200000,
    chain: 'Ethereum',
    txHash: '0xdef456...',
  },
  {
    id: '3',
    token: 'DAI',
    tokenSymbol: 'DAI',
    spender: '0xbeef...cafe',
    spenderName: 'Aave V3',
    amount: '25,000',
    action: 'granted',
    timestamp: Date.now() - 86400000,
    chain: 'Ethereum',
    txHash: '0x789ghi...',
  },
  {
    id: '4',
    token: 'USDC',
    tokenSymbol: 'USDC',
    spender: '0xcafe...babe',
    spenderName: 'Curve Finance',
    amount: '5,000',
    action: 'granted',
    timestamp: Date.now() - 172800000,
    chain: 'Monad',
    txHash: '0xjkl012...',
  },
];

export const mockChartData = {
  permissionsOverTime: [
    { date: '2024-01-01', granted: 12, revoked: 3 },
    { date: '2024-01-02', granted: 8, revoked: 5 },
    { date: '2024-01-03', granted: 15, revoked: 2 },
    { date: '2024-01-04', granted: 6, revoked: 8 },
    { date: '2024-01-05', granted: 10, revoked: 4 },
    { date: '2024-01-06', granted: 18, revoked: 6 },
    { date: '2024-01-07', granted: 14, revoked: 3 },
  ],
  tokenDistribution: [
    { name: 'USDC', value: 45, fill: 'hsl(239, 84%, 67%)' },
    { name: 'USDT', value: 30, fill: 'hsl(280, 87%, 65%)' },
    { name: 'DAI', value: 15, fill: 'hsl(142, 76%, 36%)' },
    { name: 'Other', value: 10, fill: 'hsl(215, 20%, 65%)' },
  ],
  valueAtRisk: [
    { date: '2024-01-01', value: 75000 },
    { date: '2024-01-02', value: 82000 },
    { date: '2024-01-03', value: 78000 },
    { date: '2024-01-04', value: 85000 },
    { date: '2024-01-05', value: 88000 },
    { date: '2024-01-06', value: 92000 },
    { date: '2024-01-07', value: 90000 },
  ],
};
