import { MemeCoinMetadata } from '../types/coin';

// IPFS configuration
const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;

// Fallback to mock implementation if no Pinata credentials
const USE_MOCK_IPFS = !PINATA_JWT && !PINATA_API_KEY;

// Mock storage for development
const mockIPFSStorage = new Map<string, any>();

/**
 * Upload an image to IPFS using Pinata or mock implementation
 * @param imageBlob - The image blob to upload
 * @returns Promise<string> - The IPFS hash
 */
export async function uploadImageToIPFS(imageBlob: Blob): Promise<string> {
  try {
    // Debug environment variables
    console.log('IPFS Configuration:', {
      USE_MOCK_IPFS,
      hasJWT: !!PINATA_JWT,
      hasAPIKey: !!PINATA_API_KEY,
      hasSecretKey: !!PINATA_SECRET_KEY,
      jwtLength: PINATA_JWT?.length || 0
    });

    if (USE_MOCK_IPFS) {
      // Mock implementation for demo
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      console.log('Mock IPFS upload - Image blob size:', imageBlob.size, 'bytes');
      console.log('Mock IPFS hash:', mockHash);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockHash;
    }

    // Real Pinata upload
    const formData = new FormData();
    formData.append('file', imageBlob);

    const metadata = JSON.stringify({
      name: `meme-image-${Date.now()}`,
      keyvalues: {
        type: 'meme-image',
        timestamp: Date.now().toString(),
      }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const headers: HeadersInit = {};
    if (PINATA_JWT) {
      headers['Authorization'] = `Bearer ${PINATA_JWT}`;
      console.log('Using JWT authentication for Pinata');
    } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      headers['pinata_api_key'] = PINATA_API_KEY;
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
      console.log('Using API Key authentication for Pinata');
    } else {
      console.error('No Pinata authentication credentials found!');
    }

    console.log('Uploading to Pinata with headers:', Object.keys(headers));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pinata error response:', errorText);
      throw new Error(`Pinata upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Image uploaded to IPFS via Pinata:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading image to IPFS:', error);
    throw new Error('Failed to upload image to IPFS');
  }
}

/**
 * Upload metadata to IPFS using Pinata or mock implementation
 * @param metadata - The metadata object to upload
 * @returns Promise<string> - The IPFS hash
 */
export async function uploadMetadataToIPFS(metadata: MemeCoinMetadata): Promise<string> {
  try {
    if (USE_MOCK_IPFS) {
      // Mock implementation for demo
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      console.log('Mock IPFS upload - Metadata:', metadata);
      console.log('Mock IPFS hash:', mockHash);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockHash;
    }

    // Real Pinata upload
    const jsonBlob = new Blob([JSON.stringify(metadata, null, 2)], {
      type: 'application/json',
    });

    const formData = new FormData();
    formData.append('file', jsonBlob, 'metadata.json');

    const pinataMetadata = JSON.stringify({
      name: `meme-coin-metadata-${Date.now()}`,
      keyvalues: {
        type: 'meme-coin-metadata',
        coinName: metadata.name,
        coinSymbol: metadata.symbol,
        timestamp: Date.now().toString(),
      }
    });
    formData.append('pinataMetadata', pinataMetadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    const headers: HeadersInit = {};
    if (PINATA_JWT) {
      headers['Authorization'] = `Bearer ${PINATA_JWT}`;
    } else if (PINATA_API_KEY && PINATA_SECRET_KEY) {
      headers['pinata_api_key'] = PINATA_API_KEY;
      headers['pinata_secret_api_key'] = PINATA_SECRET_KEY;
    }

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Pinata upload failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Metadata uploaded to IPFS via Pinata:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Fetch content from IPFS
 * @param hash - The IPFS hash
 * @returns Promise<string> - The content as string
 */
export async function fetchFromIPFS(hash: string): Promise<string> {
  try {
    const response = await fetch(`${IPFS_GATEWAY}${hash}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}

/**
 * Create a complete IPFS URL from hash
 * @param hash - The IPFS hash
 * @returns string - The complete IPFS URL
 */
export function createIPFSUrl(hash: string): string {
  return `ipfs://${hash}`;
}

/**
 * Get HTTP URL for IPFS content
 * @param hash - The IPFS hash
 * @returns string - The HTTP URL
 */
export function getIPFSHttpUrl(hash: string): string {
  return `${IPFS_GATEWAY}${hash}`;
}

/**
 * Convert image URL to blob for IPFS upload
 * @param imageUrl - The image URL
 * @returns Promise<Blob> - The image blob
 */
export async function imageUrlToBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error converting image URL to blob:', error);
    throw new Error('Failed to convert image to blob');
  }
}

/**
 * Upload meme image and create metadata for coin creation
 * @param memeImageUrl - The meme image URL
 * @param metadata - The coin metadata
 * @returns Promise<{imageHash: string, metadataHash: string}> - The IPFS hashes
 */
export async function uploadMemeForCoin(
  memeImageUrl: string,
  metadata: Omit<MemeCoinMetadata, 'image'>
): Promise<{ imageHash: string; metadataHash: string }> {
  try {
    // Convert image URL to blob and upload to IPFS
    const imageBlob = await imageUrlToBlob(memeImageUrl);
    const imageHash = await uploadImageToIPFS(imageBlob);
    
    // Create complete metadata with IPFS image URL
    const completeMetadata: MemeCoinMetadata = {
      ...metadata,
      image: createIPFSUrl(imageHash),
    };
    
    // Upload metadata to IPFS
    const metadataHash = await uploadMetadataToIPFS(completeMetadata);
    
    return { imageHash, metadataHash };
  } catch (error) {
    console.error('Error uploading meme for coin:', error);
    throw new Error('Failed to upload meme for coin creation');
  }
}
