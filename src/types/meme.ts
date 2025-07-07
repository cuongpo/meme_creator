export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  categories: string[];
  textPositions: {
    top?: {
      x: number;
      y: number;
      maxWidth: number;
    };
    bottom?: {
      x: number;
      y: number;
      maxWidth: number;
    };
  };
}

export interface MemeGenerationRequest {
  prompt: string;
  category?: string;
  language: string;
  resetTemplates?: boolean;
  batchIndex?: number;
}

export interface MemeResult {
  id: string;
  templateId: string;
  templateName: string;
  imageUrl: string;
  topText?: string;
  bottomText?: string;
  prompt: string;
  category?: string;
  language: string;
  createdAt?: Date;

  // Popularity metrics for coin eligibility
  popularity?: {
    views: number;
    likes: number;
    shares: number;
    downloads: number;
    comments: number;
    createdAt: Date;
    lastInteraction: Date;
  };

  // Coin-related properties
  isEligibleForCoin?: boolean;
  coinCreated?: boolean;
  coinAddress?: string;
}

export interface MemeApiResponse {
  success: boolean;
  data?: MemeResult;
  error?: string;
}
