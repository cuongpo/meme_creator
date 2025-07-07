import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { MemeResult } from '../types/meme';
import { MemeCoin, MemePopularityMetrics, isEligibleForCoin, calculateEngagementScore } from '../types/coin';
import { Address } from 'viem';
import { saveMemes, loadMemes, saveCoins, loadCoins } from '../utils/storage';

interface MemeContextType {
  // Meme management
  memes: MemeResult[];
  addMeme: (meme: MemeResult) => void;
  updateMeme: (id: string, updates: Partial<MemeResult>) => void;
  getMeme: (id: string) => MemeResult | undefined;
  deleteMeme: (id: string) => void;

  // Popularity tracking
  incrementViews: (memeId: string) => void;
  incrementLikes: (memeId: string) => void;
  incrementShares: (memeId: string, platform?: string) => void;
  incrementDownloads: (memeId: string) => void;
  incrementComments: (memeId: string) => void;

  // Advanced engagement tracking
  trackEngagement: (memeId: string, action: string, metadata?: any) => void;
  getEngagementHistory: (memeId: string) => any[];
  simulateViralGrowth: (memeId: string) => void;

  // Coin management
  coins: MemeCoin[];
  getEligibleMemes: () => MemeResult[];
  createCoinFromMeme: (memeId: string, creator: Address) => Promise<void>;
  getCoinByMemeId: (memeId: string) => MemeCoin | undefined;

  // Statistics and analytics
  getTotalEngagement: () => number;
  getTopMemes: (limit?: number) => MemeResult[];
  getTrendingMemes: (timeframe?: 'hour' | 'day' | 'week') => MemeResult[];
  getMemesByCategory: (category: string) => MemeResult[];
  getEngagementTrends: () => any;
}

const MemeContext = createContext<MemeContextType | undefined>(undefined);

export function useMemeContext() {
  const context = useContext(MemeContext);
  if (!context) {
    throw new Error('useMemeContext must be used within a MemeProvider');
  }
  return context;
}

interface MemeProviderProps {
  children: ReactNode;
}

export function MemeProvider({ children }: MemeProviderProps) {
  const [memes, setMemes] = useState<MemeResult[]>([]);
  const [coins, setCoins] = useState<MemeCoin[]>([]);
  const [engagementHistory, setEngagementHistory] = useState<Record<string, any[]>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedMemes = loadMemes();
    const savedCoins = loadCoins();

    if (savedMemes.length > 0) {
      setMemes(savedMemes);
    }

    if (savedCoins.length > 0) {
      setCoins(savedCoins);
    }

    // Initialize engagement history for existing memes
    const history: Record<string, any[]> = {};
    savedMemes.forEach(meme => {
      history[meme.id] = [];
    });
    setEngagementHistory(history);
  }, []);

  // Save memes to localStorage whenever memes change
  useEffect(() => {
    if (memes.length > 0) {
      saveMemes(memes);
    }
  }, [memes]);

  // Save coins to localStorage whenever coins change
  useEffect(() => {
    if (coins.length > 0) {
      saveCoins(coins);
    }
  }, [coins]);

  // Initialize meme with default popularity metrics
  const initializeMemePopularity = (meme: MemeResult): MemeResult => {
    if (!meme.popularity) {
      return {
        ...meme,
        createdAt: new Date(),
        popularity: {
          views: 0,
          likes: 0,
          shares: 0,
          downloads: 0,
          comments: 0,
          createdAt: new Date(),
          lastInteraction: new Date(),
        },
        isEligibleForCoin: false,
        coinCreated: false,
      };
    }
    return meme;
  };

  // Add a new meme
  const addMeme = useCallback((meme: MemeResult) => {
    const initializedMeme = initializeMemePopularity(meme);
    setMemes(prev => [...prev, initializedMeme]);
  }, []);

  // Update a meme
  const updateMeme = useCallback((id: string, updates: Partial<MemeResult>) => {
    setMemes(prev => prev.map(meme => 
      meme.id === id 
        ? { 
            ...meme, 
            ...updates,
            popularity: updates.popularity ? {
              ...meme.popularity!,
              ...updates.popularity,
              lastInteraction: new Date(),
            } : meme.popularity
          }
        : meme
    ));
  }, []);

  // Get a specific meme
  const getMeme = useCallback((id: string) => {
    return memes.find(meme => meme.id === id);
  }, [memes]);

  // Delete a meme
  const deleteMeme = useCallback((id: string) => {
    setMemes(prev => prev.filter(meme => meme.id !== id));
    setEngagementHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[id];
      return newHistory;
    });
  }, []);

  // Popularity tracking functions
  const updatePopularity = useCallback((memeId: string, field: keyof MemePopularityMetrics, increment: number = 1) => {
    setMemes(prev => prev.map(meme => {
      if (meme.id === memeId && meme.popularity) {
        const updatedPopularity = {
          ...meme.popularity,
          [field]: typeof meme.popularity[field] === 'number'
            ? (meme.popularity[field] as number) + increment
            : increment,
          lastInteraction: new Date(),
          createdAt: meme.popularity.createdAt || new Date(),
        };
        
        const isEligible = isEligibleForCoin(updatedPopularity);
        
        return {
          ...meme,
          popularity: updatedPopularity,
          isEligibleForCoin: isEligible,
        };
      }
      return meme;
    }));
  }, []);

  const incrementViews = useCallback((memeId: string) => {
    updatePopularity(memeId, 'views');
  }, [updatePopularity]);

  const incrementLikes = useCallback((memeId: string) => {
    updatePopularity(memeId, 'likes');
  }, [updatePopularity]);

  const incrementShares = useCallback((memeId: string, platform?: string) => {
    updatePopularity(memeId, 'shares');
    trackEngagement(memeId, 'share', { platform: platform || 'unknown' });
  }, [updatePopularity]);

  const incrementDownloads = useCallback((memeId: string) => {
    updatePopularity(memeId, 'downloads');
  }, [updatePopularity]);

  const incrementComments = useCallback((memeId: string) => {
    updatePopularity(memeId, 'comments');
  }, [updatePopularity]);

  // Advanced engagement tracking
  const trackEngagement = useCallback((memeId: string, action: string, metadata?: any) => {
    const engagement = {
      action,
      timestamp: new Date(),
      metadata: metadata || {},
    };

    setEngagementHistory(prev => ({
      ...prev,
      [memeId]: [...(prev[memeId] || []), engagement],
    }));
  }, []);

  const getEngagementHistory = useCallback((memeId: string) => {
    return engagementHistory[memeId] || [];
  }, [engagementHistory]);

  // Simulate viral growth for demo purposes
  const simulateViralGrowth = useCallback((memeId: string) => {
    const meme = getMeme(memeId);
    if (!meme || !meme.popularity) return;

    // Simulate viral growth with random but realistic increases
    const viralMultiplier = Math.random() * 5 + 2; // 2x to 7x growth
    const baseViews = Math.floor(Math.random() * 1000) + 500;
    const baseLikes = Math.floor(baseViews * 0.1 * Math.random());
    const baseShares = Math.floor(baseLikes * 0.3 * Math.random());
    const baseDownloads = Math.floor(baseLikes * 0.5 * Math.random());
    const baseComments = Math.floor(baseLikes * 0.2 * Math.random());

    updateMeme(memeId, {
      popularity: {
        ...meme.popularity,
        views: meme.popularity.views + Math.floor(baseViews * viralMultiplier),
        likes: meme.popularity.likes + Math.floor(baseLikes * viralMultiplier),
        shares: meme.popularity.shares + Math.floor(baseShares * viralMultiplier),
        downloads: meme.popularity.downloads + Math.floor(baseDownloads * viralMultiplier),
        comments: meme.popularity.comments + Math.floor(baseComments * viralMultiplier),
        lastInteraction: new Date(),
      }
    });

    trackEngagement(memeId, 'viral_growth', { multiplier: viralMultiplier });
  }, [getMeme, updateMeme, trackEngagement]);

  // Get memes eligible for coin creation
  const getEligibleMemes = useCallback(() => {
    return memes.filter(meme => 
      meme.isEligibleForCoin && !meme.coinCreated
    );
  }, [memes]);

  // Create a coin from a meme (placeholder - actual implementation will be in components)
  const createCoinFromMeme = useCallback(async (memeId: string, creator: Address) => {
    const meme = getMeme(memeId);
    if (!meme || !meme.isEligibleForCoin || meme.coinCreated) {
      throw new Error('Meme is not eligible for coin creation');
    }

    // This will be implemented in the actual coin creation component
    // For now, just mark the meme as having a coin created
    updateMeme(memeId, { coinCreated: true });
  }, [getMeme, updateMeme]);

  // Get coin by meme ID
  const getCoinByMemeId = useCallback((memeId: string) => {
    return coins.find(coin => coin.memeId === memeId);
  }, [coins]);

  // Get total engagement across all memes
  const getTotalEngagement = useCallback(() => {
    return memes.reduce((total, meme) => {
      if (meme.popularity) {
        return total + calculateEngagementScore(meme.popularity);
      }
      return total;
    }, 0);
  }, [memes]);

  // Get top memes by engagement score
  const getTopMemes = useCallback((limit: number = 10) => {
    return [...memes]
      .filter(meme => meme.popularity)
      .sort((a, b) => {
        const scoreA = calculateEngagementScore(a.popularity!);
        const scoreB = calculateEngagementScore(b.popularity!);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }, [memes]);

  // Get trending memes based on recent activity
  const getTrendingMemes = useCallback((timeframe: 'hour' | 'day' | 'week' = 'day') => {
    const now = new Date();
    const timeframeDuration = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    };

    const cutoff = new Date(now.getTime() - timeframeDuration[timeframe]);

    return [...memes]
      .filter(meme =>
        meme.popularity &&
        meme.popularity.lastInteraction &&
        new Date(meme.popularity.lastInteraction) > cutoff
      )
      .sort((a, b) => {
        const scoreA = calculateEngagementScore(a.popularity!);
        const scoreB = calculateEngagementScore(b.popularity!);
        const timeA = new Date(a.popularity!.lastInteraction).getTime();
        const timeB = new Date(b.popularity!.lastInteraction).getTime();

        // Weight by both engagement score and recency
        const weightedScoreA = scoreA * (timeA / now.getTime());
        const weightedScoreB = scoreB * (timeB / now.getTime());

        return weightedScoreB - weightedScoreA;
      })
      .slice(0, 10);
  }, [memes]);

  // Get memes by category
  const getMemesByCategory = useCallback((category: string) => {
    return memes.filter(meme =>
      meme.category?.toLowerCase() === category.toLowerCase()
    );
  }, [memes]);

  // Get engagement trends
  const getEngagementTrends = useCallback(() => {
    const trends = {
      totalMemes: memes.length,
      totalEngagement: getTotalEngagement(),
      averageEngagement: memes.length > 0 ? getTotalEngagement() / memes.length : 0,
      eligibleMemes: getEligibleMemes().length,
      coinCreatedMemes: memes.filter(m => m.coinCreated).length,
      categories: {} as Record<string, number>,
      recentActivity: [] as any[],
    };

    // Category breakdown
    memes.forEach(meme => {
      const category = meme.category || 'Uncategorized';
      trends.categories[category] = (trends.categories[category] || 0) + 1;
    });

    // Recent activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    Object.entries(engagementHistory).forEach(([memeId, history]) => {
      const recentActions = history.filter(action =>
        new Date(action.timestamp) > yesterday
      );
      if (recentActions.length > 0) {
        trends.recentActivity.push({
          memeId,
          actions: recentActions.length,
          lastAction: recentActions[recentActions.length - 1],
        });
      }
    });

    return trends;
  }, [memes, getTotalEngagement, getEligibleMemes, engagementHistory]);

  const value: MemeContextType = {
    memes,
    addMeme,
    updateMeme,
    getMeme,
    deleteMeme,
    incrementViews,
    incrementLikes,
    incrementShares,
    incrementDownloads,
    incrementComments,
    trackEngagement,
    getEngagementHistory,
    simulateViralGrowth,
    coins,
    getEligibleMemes,
    createCoinFromMeme,
    getCoinByMemeId,
    getTotalEngagement,
    getTopMemes,
    getTrendingMemes,
    getMemesByCategory,
    getEngagementTrends,
  };

  return (
    <MemeContext.Provider value={value}>
      {children}
    </MemeContext.Provider>
  );
}
