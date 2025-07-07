import { MemeResult } from '../types/meme';
import { MemeCoin } from '../types/coin';

const STORAGE_KEYS = {
  MEMES: 'meme_creator_memes',
  COINS: 'meme_creator_coins',
  USER_PREFERENCES: 'meme_creator_preferences',
};

// Meme storage functions
export function saveMemes(memes: MemeResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMES, JSON.stringify(memes));
  } catch (error) {
    console.error('Error saving memes to localStorage:', error);
  }
}

export function loadMemes(): MemeResult[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MEMES);
    if (stored) {
      const memes = JSON.parse(stored);
      // Convert date strings back to Date objects
      return memes.map((meme: any) => ({
        ...meme,
        createdAt: meme.createdAt ? new Date(meme.createdAt) : new Date(),
        popularity: meme.popularity ? {
          ...meme.popularity,
          lastInteraction: new Date(meme.popularity.lastInteraction),
        } : undefined,
      }));
    }
  } catch (error) {
    console.error('Error loading memes from localStorage:', error);
  }
  return [];
}

// Coin storage functions
export function saveCoins(coins: MemeCoin[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COINS, JSON.stringify(coins));
  } catch (error) {
    console.error('Error saving coins to localStorage:', error);
  }
}

export function loadCoins(): MemeCoin[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COINS);
    if (stored) {
      const coins = JSON.parse(stored);
      // Convert date strings back to Date objects
      return coins.map((coin: any) => ({
        ...coin,
        createdAt: new Date(coin.createdAt),
        metadata: {
          ...coin.metadata,
          popularity: {
            ...coin.metadata.popularity,
            createdAt: new Date(coin.metadata.popularity.createdAt),
            lastInteraction: new Date(coin.metadata.popularity.lastInteraction),
          },
        },
      }));
    }
  } catch (error) {
    console.error('Error loading coins from localStorage:', error);
  }
  return [];
}

// User preferences
interface UserPreferences {
  defaultChain: number;
  autoCreateCoins: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}

export function saveUserPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences:', error);
  }
}

export function loadUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading user preferences:', error);
  }
  
  // Default preferences
  return {
    defaultChain: 8453, // Base mainnet
    autoCreateCoins: false,
    notificationsEnabled: true,
    theme: 'light',
  };
}

// Clear all stored data
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
}

// Export/import data for backup
export function exportData(): string {
  const data = {
    memes: loadMemes(),
    coins: loadCoins(),
    preferences: loadUserPreferences(),
    exportDate: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.memes) {
      saveMemes(data.memes);
    }
    
    if (data.coins) {
      saveCoins(data.coins);
    }
    
    if (data.preferences) {
      saveUserPreferences(data.preferences);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
