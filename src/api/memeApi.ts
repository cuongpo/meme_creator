import axios from 'axios';
import { MemeGenerationRequest, MemeResult, MemeApiResponse, MemeTemplate } from '../types/meme';

// API base URL - in production, use relative "/api" so frontend and backend work on the same domain (Render deployment)
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5001/api';

// Generate a meme using the backend API
export const generateMeme = async (request: MemeGenerationRequest): Promise<MemeResult> => {
  try {
    const response = await axios.post<MemeApiResponse>(
      `${API_BASE_URL}/generate-meme`,
      request
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to generate meme');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error in generateMeme:', error);
    throw error;
  }
};

// Get all available meme templates
export const getMemeTemplates = async (): Promise<MemeTemplate[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch templates');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};
