// Popular ERC-20 tokens to track approvals for
export const TRACKED_TOKENS: Record<number, { address: `0x${string}`; symbol: string; name: string; decimals: number; logo: string }[]> = {
  // Ethereum Mainnet
  1: [
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    },
    {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    },
    {
      address: '0x6B175474E89094C44Da98b954EesecAC495271d0F',
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
      logo: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    },
    {
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      name: 'Wrapped Bitcoin',
      decimals: 8,
      logo: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
    },
    {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    },
  ],
  // Sepolia Testnet
  11155111: [
    {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    },
    {
      address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
      symbol: 'USDT',
      name: 'Tether USD',
      decimals: 6,
      logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    },
  ],
  // Monad Testnet (placeholder tokens)
  41454: [
    {
      address: '0x0000000000000000000000000000000000000001',
      symbol: 'MON',
      name: 'Monad',
      decimals: 18,
      logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    },
  ],
};

// Well-known spender addresses with names
export const KNOWN_SPENDERS: Record<string, string> = {
  // Uniswap
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap Router',
  '0xe592427a0aece92de3edee1f18e0157c05861564': 'Uniswap V3 Router',
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2 Router',
  '0x000000000022d473030f116ddee9f6b43ac78ba3': 'Uniswap Permit2',
  // Aave
  '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2': 'Aave V3 Pool',
  '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9': 'Aave V2 Pool',
  // Curve
  '0x99a58482bd75cbab83b27ec03ca68ff489b5788f': 'Curve Router',
  // 1inch
  '0x1111111254eeb25477b68fb85ed929f73a960582': '1inch Router V5',
  '0x111111125421ca6dc452d289314280a0f8842a65': '1inch Router V6',
  // OpenSea
  '0x1e0049783f008a0085193e00003d00cd54003c71': 'OpenSea Seaport',
  // SushiSwap
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': 'SushiSwap Router',
};

export function getSpenderName(address: string): string {
  const normalized = address.toLowerCase();
  return KNOWN_SPENDERS[normalized] || 'Unknown Contract';
}

export function getChainName(chainId: number): string {
  switch (chainId) {
    case 1: return 'Ethereum';
    case 11155111: return 'Sepolia';
    case 41454: return 'Monad';
    default: return 'Unknown';
  }
}
