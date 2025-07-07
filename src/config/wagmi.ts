import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect, injected } from 'wagmi/connectors';

// Project ID from WalletConnect Cloud - get a valid one from https://cloud.walletconnect.com/
// The current one appears to be invalid/incomplete
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'c4f79cc821944d9680842e34466bfbd';

// Define the chains we want to support
const chains = [base, baseSepolia] as const;

// Create wagmi config with better error handling
export const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({
      appName: 'Meme Coin Creator',
      appLogoUrl: 'https://meme-coin-creator.vercel.app/logo.png',
    }),
    // Only include WalletConnect if we have a valid project ID
    ...(projectId && projectId !== 'c4f79cc821944d9680842e34466bfbd' && projectId.length > 20 ? [
      walletConnect({
        projectId,
        metadata: {
          name: 'Meme Coin Creator',
          description: 'Create valuable coins from popular memes on Zora',
          url: 'https://meme-coin-creator.vercel.app',
          icons: ['https://meme-coin-creator.vercel.app/logo.png'],
        },
      })
    ] : []),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});

// Export chain configurations for easy access
export { base, baseSepolia };
export const defaultChain = base;

// Zora protocol configuration
export const ZORA_CONFIG = {
  // Default to Base Sepolia for testing, Base mainnet for production
  defaultChainId: process.env.NODE_ENV === 'development' ? baseSepolia.id : base.id,

  // Supported chains for Zora coins
  supportedChains: [base.id, baseSepolia.id],

  // IPFS gateway for metadata
  ipfsGateway: 'https://ipfs.io/ipfs/',

  // Default currency for coin creation (ZORA on Base, ETH on other chains)
  getDefaultCurrency: (chainId: number) => {
    return chainId === base.id ? 'ZORA' : 'ETH';
  },

  // Zora test URLs
  getZoraUrl: (chainId: number, contractAddress: string) => {
    if (chainId === baseSepolia.id) {
      return `https://testnet.zora.co/coin/bsep:${contractAddress}`;
    } else if (chainId === base.id) {
      return `https://zora.co/coin/base:${contractAddress}`;
    }
    return `https://testnet.zora.co/coin/${chainId}:${contractAddress}`;
  },
};
