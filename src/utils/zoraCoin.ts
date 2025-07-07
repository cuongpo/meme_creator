import { createCoin, createCoinCall, DeployCurrency, validateMetadataURIContent } from '@zoralabs/coins-sdk';
import { Address, createPublicClient, http, WalletClient, PublicClient } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { CoinCreationRequest, CoinCreationResult, MemeCoinMetadata } from '../types/coin';
import { uploadMemeForCoin, createIPFSUrl } from './ipfs';

// Get the appropriate chain configuration
export function getChainConfig(chainId: number) {
  switch (chainId) {
    case base.id:
      return base;
    case baseSepolia.id:
      return baseSepolia;
    default:
      return base; // Default to Base mainnet
  }
}

// Create public client for the specified chain
export function createPublicClientForChain(chainId: number) {
  const chain = getChainConfig(chainId);
  return createPublicClient({
    chain,
    transport: http(),
  });
}

// Get default currency for the chain
export function getDefaultCurrency(chainId: number): DeployCurrency {
  // ZORA is available on Base mainnet, ETH on other chains
  return chainId === base.id ? DeployCurrency.ZORA : DeployCurrency.ETH;
}

/**
 * Generate Zora test URL for the created coin
 * @param contractAddress - The deployed coin contract address
 * @param chainId - The chain ID where the coin was deployed
 * @returns string - The Zora test URL
 */
export function generateZoraTestUrl(contractAddress: Address, chainId: number): string {
  if (chainId === baseSepolia.id) {
    // Base Sepolia testnet format: testnet.zora.co/coin/bsep:[token_address]
    return `https://testnet.zora.co/coin/bsep:${contractAddress}`;
  } else if (chainId === base.id) {
    // Base mainnet format: zora.co/coin/base:[token_address]
    return `https://zora.co/coin/base:${contractAddress}`;
  } else {
    // Fallback for other chains
    return `https://testnet.zora.co/coin/${chainId}:${contractAddress}`;
  }
}

/**
 * Check if the chain supports Zora coins
 * @param chainId - The chain ID to check
 * @returns boolean - Whether the chain is supported
 */
export function isZoraSupportedChain(chainId: number): boolean {
  return chainId === base.id || chainId === baseSepolia.id;
}

/**
 * Create a coin from a popular meme using Zora's coins SDK
 * @param request - The coin creation request
 * @param memeImageUrl - The meme image URL
 * @param metadata - The meme metadata
 * @param walletClient - The wallet client for signing transactions
 * @param chainId - The chain ID to deploy on
 * @returns Promise<CoinCreationResult> - The creation result
 */
export async function createCoinFromMeme(
  request: CoinCreationRequest,
  memeImageUrl: string,
  metadata: Omit<MemeCoinMetadata, 'image'>,
  walletClient: WalletClient,
  chainId: number = base.id
): Promise<CoinCreationResult> {
  try {
    console.log('Creating coin from meme using Zora SDK:', {
      request,
      memeImageUrl,
      metadata,
      chainId
    });

    // Upload meme image and metadata to IPFS
    const { metadataHash } = await uploadMemeForCoin(memeImageUrl, metadata);
    const metadataUri = createIPFSUrl(metadataHash);

    console.log('Metadata URI:', metadataUri);

    // Validate metadata URI content
    try {
      await validateMetadataURIContent(metadataUri as any);
    } catch (validationError) {
      console.warn('Metadata validation warning:', validationError);
      // Continue with coin creation even if validation fails
    }

    // Create public client for the chain
    const publicClient = createPublicClientForChain(chainId);

    // Prepare coin creation parameters
    const coinParams = {
      name: request.name,
      symbol: request.symbol,
      uri: metadataUri,
      chainId,
      payoutRecipient: request.payoutRecipient,
      platformReferrer: request.platformReferrer,
      currency: getDefaultCurrency(chainId),
    };

    console.log('Creating coin with params:', coinParams);

    // Create the coin using Zora's SDK
    const result = await createCoin(
      coinParams as any,
      walletClient,
      publicClient
    );

    console.log('Coin created successfully:', {
      transactionHash: result.hash,
      contractAddress: result.address
    });

    // Generate Zora test URL
    const zoraTestUrl = generateZoraTestUrl(result.address, chainId);

    return {
      success: true,
      transactionHash: result.hash,
      contractAddress: result.address,
      zoraTestUrl,
      chainId,
    };
  } catch (error) {
    console.error('Error creating coin from meme:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create coin',
    };
  }
}

/**
 * Create coin call parameters for use with wagmi hooks
 * @param request - The coin creation request
 * @param metadataUri - The metadata URI (IPFS)
 * @param chainId - The chain ID
 * @returns Promise<any> - The contract call parameters
 */
export async function createCoinCallParams(
  request: CoinCreationRequest,
  metadataUri: string,
  chainId: number = base.id
) {
  try {
    console.log('Creating coin call params using Zora SDK:', {
      request,
      metadataUri,
      chainId
    });

    // Validate metadata URI content
    try {
      await validateMetadataURIContent(metadataUri as any);
    } catch (validationError) {
      console.warn('Metadata validation warning:', validationError);
    }

    // Prepare coin creation parameters
    const coinParams = {
      name: request.name,
      symbol: request.symbol,
      uri: metadataUri,
      chainId,
      payoutRecipient: request.payoutRecipient,
      platformReferrer: request.platformReferrer,
      currency: getDefaultCurrency(chainId),
    };

    // Create contract call parameters using Zora's SDK
    const callParams = await createCoinCall(coinParams as any);

    console.log('Generated call params:', callParams);

    return callParams;
  } catch (error) {
    console.error('Error creating coin call params:', error);
    throw error;
  }
}

/**
 * Generate coin name and symbol from meme data
 * @param templateName - The meme template name
 * @param topText - The top text of the meme
 * @param bottomText - The bottom text of the meme
 * @returns {name: string, symbol: string} - Generated name and symbol
 */
export function generateCoinNameAndSymbol(
  templateName: string,
  topText?: string,
  bottomText?: string
): { name: string; symbol: string } {
  // Create a descriptive name
  const textPart = topText || bottomText || '';
  const shortText = textPart.length > 20 ? textPart.substring(0, 20) + '...' : textPart;
  const name = shortText ? `${templateName} - ${shortText}` : templateName;
  
  // Create a symbol from template name and text
  const templateSymbol = templateName
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, 4);
  
  const textSymbol = (topText || bottomText || '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .substring(0, 3);
  
  const symbol = textSymbol ? `${templateSymbol}${textSymbol}` : `${templateSymbol}COIN`;
  
  return {
    name: name.length > 50 ? name.substring(0, 50) + '...' : name,
    symbol: symbol.substring(0, 8), // Max 8 characters for symbol
  };
}

/**
 * Create metadata for coin from meme data
 * @param meme - The meme data
 * @param creator - The creator address
 * @returns MemeCoinMetadata - The metadata object
 */
export function createCoinMetadataFromMeme(
  meme: any,
  creator: Address
): Omit<MemeCoinMetadata, 'image'> {
  const { name, symbol } = generateCoinNameAndSymbol(
    meme.templateName,
    meme.topText,
    meme.bottomText
  );
  
  return {
    name,
    symbol,
    description: `A valuable coin created from the popular "${meme.templateName}" meme. ${meme.topText ? `Top: "${meme.topText}"` : ''} ${meme.bottomText ? `Bottom: "${meme.bottomText}"` : ''}`,
    external_url: `https://meme-coin-creator.vercel.app/meme/${meme.id}`,
    attributes: [
      {
        trait_type: 'Template',
        value: meme.templateName,
      },
      {
        trait_type: 'Category',
        value: meme.category || 'General',
      },
      {
        trait_type: 'Language',
        value: meme.language || 'en',
      },
      {
        trait_type: 'Creator',
        value: creator,
      },
      {
        trait_type: 'Popularity Score',
        value: meme.popularity ? 
          (meme.popularity.likes * 3 + meme.popularity.shares * 5 + meme.popularity.views) : 0,
      },
    ],
    meme: {
      templateId: meme.templateId,
      templateName: meme.templateName,
      topText: meme.topText,
      bottomText: meme.bottomText,
      originalPrompt: meme.prompt,
      category: meme.category,
      language: meme.language || 'en',
    },
    popularity: meme.popularity || {
      views: 0,
      likes: 0,
      shares: 0,
      downloads: 0,
      comments: 0,
      createdAt: new Date(),
      lastInteraction: new Date(),
    },
  };
}
