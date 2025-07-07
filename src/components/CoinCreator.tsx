import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Paper,
  Link,
} from '@mui/material';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { MemeResult } from '../types/meme';
import { createCoinFromMeme, generateCoinNameAndSymbol, createCoinMetadataFromMeme } from '../utils/zoraCoin';
import { useMemeContext } from '../contexts/MemeContext';
import { Address } from 'viem';
import toast from 'react-hot-toast';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LaunchIcon from '@mui/icons-material/Launch';
import { calculateEngagementScore } from '../types/coin';

interface CoinCreatorProps {
  open: boolean;
  onClose: () => void;
  meme: MemeResult | null;
}

const CoinCreator: React.FC<CoinCreatorProps> = ({ open, onClose, meme }) => {
  const [loading, setLoading] = useState(false);
  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdCoinData, setCreatedCoinData] = useState<any>(null);
  
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { updateMeme } = useMemeContext();

  // Initialize coin name and symbol when meme changes
  React.useEffect(() => {
    if (meme) {
      const { name, symbol } = generateCoinNameAndSymbol(
        meme.templateName,
        meme.topText,
        meme.bottomText
      );
      setCoinName(name);
      setCoinSymbol(symbol);
    }
  }, [meme]);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setError('');
      setSuccess(false);
      setCreatedCoinData(null);
      setLoading(false);
    }
  }, [open]);

  // Function to get meme image with text overlay (same logic as MemeDisplay)
  const getMemeImageWithText = (meme: MemeResult): string => {
    if (!meme || !meme.imageUrl) return '';

    // Function to add text to the meme image using memegen.link API
    const addTextToMeme = (imageUrl: string, topText?: string, bottomText?: string) => {
      // If no text is provided, return the original image
      if (!topText && !bottomText) {
        return imageUrl;
      }

      // Clean and prepare text for URL encoding
      const cleanText = (text?: string) => {
        if (!text) return '_';
        // Replace spaces with underscores and encode special characters
        return encodeURIComponent(text.replace(/\s+/g, '_').replace(/[^\w\s-_.]/g, ''));
      };

      const topTextEncoded = cleanText(topText);
      const bottomTextEncoded = cleanText(bottomText);

      // Use memegen.link custom template API
      const baseUrl = 'https://api.memegen.link/images/custom';

      // Construct the URL with proper encoding
      const memeUrl = `${baseUrl}/${topTextEncoded}/${bottomTextEncoded}.png?background=${encodeURIComponent(imageUrl)}&width=800&height=600`;

      return memeUrl;
    };

    // Use the image URL from the template
    let imageUrl = meme.imageUrl;

    // Ensure we have a valid URL
    if (!imageUrl.startsWith('http')) {
      // Fallback to a default image if the URL is invalid
      console.warn('Invalid image URL:', imageUrl);
      imageUrl = 'https://i.imgflip.com/30b1gx.jpg'; // Drake template as fallback
    }

    // Add text overlay using memegen.link API
    return addTextToMeme(imageUrl, meme.topText, meme.bottomText);
  };

  const handleCreateCoin = async () => {
    if (!meme || !address || !walletClient || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!coinName.trim() || !coinSymbol.trim()) {
      setError('Please enter coin name and symbol');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create metadata for the coin
      const metadata = createCoinMetadataFromMeme(meme, address as Address);

      // Get the meme image URL with text overlay (same logic as MemeDisplay)
      const memeImageUrl = getMemeImageWithText(meme);

      console.log('Creating coin with meme image URL:', memeImageUrl);

      // Create the coin
      const result = await createCoinFromMeme(
        {
          memeId: meme.id,
          name: coinName,
          symbol: coinSymbol,
          payoutRecipient: address as Address,
        },
        memeImageUrl,
        metadata,
        walletClient,
        publicClient?.chain?.id || 8453 // Default to Base mainnet
      );

      if (result.success) {
        // Update the meme to mark it as having a coin created
        updateMeme(meme.id, {
          coinCreated: true,
          coinAddress: result.contractAddress,
        });

        setSuccess(true);
        setCreatedCoinData(result);
        toast.success('🎉 Coin created successfully!');
      } else {
        setError(result.error || 'Failed to create coin');
        toast.error('Failed to create coin');
      }
    } catch (err) {
      console.error('Error creating coin:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Failed to create coin');
    } finally {
      setLoading(false);
    }
  };

  const engagementScore = meme?.popularity ? calculateEngagementScore(meme.popularity) : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CurrencyBitcoinIcon color="warning" />
        Create Coin from Meme
      </DialogTitle>
      
      <DialogContent>
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please connect your wallet to create a coin
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && createdCoinData && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              🎉 Coin Created Successfully!
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Contract Address:</strong> {createdCoinData.contractAddress}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Transaction Hash:</strong> {createdCoinData.transactionHash}
            </Typography>
            {createdCoinData.zoraTestUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Test your coin on Zora:</strong>
                </Typography>
                <Link
                  href={createdCoinData.zoraTestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {createdCoinData.zoraTestUrl}
                  <LaunchIcon fontSize="small" />
                </Link>
              </Box>
            )}
          </Alert>
        )}

        {meme && (
          <Box>
            {/* Meme Preview */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Meme Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <img
                    src={meme.imageUrl}
                    alt={meme.templateName}
                    style={{
                      width: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Template:</strong> {meme.templateName}
                  </Typography>
                  {meme.topText && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Top Text:</strong> {meme.topText}
                    </Typography>
                  )}
                  {meme.bottomText && (
                    <Typography variant="body2" gutterBottom>
                      <strong>Bottom Text:</strong> {meme.bottomText}
                    </Typography>
                  )}
                  <Typography variant="body2" gutterBottom>
                    <strong>Engagement Score:</strong> {engagementScore}
                  </Typography>
                  
                  {/* Popularity metrics */}
                  {meme.popularity && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip label={`👀 ${meme.popularity.views}`} size="small" />
                      <Chip label={`👍 ${meme.popularity.likes}`} size="small" />
                      <Chip label={`📤 ${meme.popularity.shares}`} size="small" />
                      <Chip label={`📥 ${meme.popularity.downloads}`} size="small" />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>

            {/* Coin Configuration */}
            <Typography variant="h6" gutterBottom>
              Coin Configuration
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Coin Name"
                  value={coinName}
                  onChange={(e) => setCoinName(e.target.value)}
                  disabled={loading}
                  helperText="The display name for your coin"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Symbol"
                  value={coinSymbol}
                  onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
                  disabled={loading}
                  inputProps={{ maxLength: 8 }}
                  helperText="Max 8 characters"
                />
              </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Creating a coin will deploy an ERC20 token on the Base network using Zora's protocol.
              You will receive creator earnings from trading activity.
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {success ? 'Close' : 'Cancel'}
        </Button>
        {!success && (
          <Button
            onClick={handleCreateCoin}
            variant="contained"
            disabled={loading || !isConnected || !meme?.isEligibleForCoin}
            startIcon={loading ? <CircularProgress size={20} /> : <CurrencyBitcoinIcon />}
          >
            {loading ? 'Creating Coin...' : 'Create Coin'}
          </Button>
        )}
        {success && createdCoinData?.zoraTestUrl && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<LaunchIcon />}
            onClick={() => window.open(createdCoinData.zoraTestUrl, '_blank')}
          >
            Test on Zora
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CoinCreator;
