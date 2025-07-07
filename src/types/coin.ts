import { Address } from 'viem';

export interface MemePopularityMetrics {
  views: number;
  likes: number;
  shares: number;
  downloads: number;
  comments: number;
  createdAt: Date;
  lastInteraction: Date;
}

export interface MemeCoinMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string; // IPFS hash or URL
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  meme: {
    templateId: string;
    templateName: string;
    topText?: string;
    bottomText?: string;
    originalPrompt: string;
    category?: string;
    language: string;
  };
  popularity: MemePopularityMetrics;
}

export interface MemeCoin {
  id: string;
  memeId: string;
  contractAddress?: Address;
  chainId: number;
  metadata: MemeCoinMetadata;
  ipfsHash?: string;
  isEligibleForCoin: boolean;
  coinCreated: boolean;
  createdAt: Date;
  creator: Address;
  
  // Trading information (populated after coin creation)
  currentPrice?: string;
  marketCap?: string;
  volume24h?: string;
  holders?: number;
}

export interface CoinCreationRequest {
  memeId: string;
  name: string;
  symbol: string;
  payoutRecipient: Address;
  platformReferrer?: Address;
}

export interface CoinCreationResult {
  success: boolean;
  transactionHash?: string;
  contractAddress?: Address;
  error?: string;
  zoraTestUrl?: string; // For testnet.zora.co testing
  chainId?: number;
}

// Popularity thresholds for coin eligibility
export const COIN_ELIGIBILITY_THRESHOLDS = {
  minLikes: 10,
  minShares: 5,
  minViews: 100,
  minEngagementScore: 50, // Calculated from all metrics
};

// Calculate engagement score from metrics
export function calculateEngagementScore(metrics: MemePopularityMetrics): number {
  const weights = {
    likes: 3,
    shares: 5,
    downloads: 2,
    comments: 4,
    views: 1,
  };
  
  return (
    metrics.likes * weights.likes +
    metrics.shares * weights.shares +
    metrics.downloads * weights.downloads +
    metrics.comments * weights.comments +
    metrics.views * weights.views
  );
}

// Check if a meme is eligible for coin creation
export function isEligibleForCoin(metrics: MemePopularityMetrics): boolean {
  const score = calculateEngagementScore(metrics);
  
  return (
    metrics.likes >= COIN_ELIGIBILITY_THRESHOLDS.minLikes &&
    metrics.shares >= COIN_ELIGIBILITY_THRESHOLDS.minShares &&
    metrics.views >= COIN_ELIGIBILITY_THRESHOLDS.minViews &&
    score >= COIN_ELIGIBILITY_THRESHOLDS.minEngagementScore
  );
}
