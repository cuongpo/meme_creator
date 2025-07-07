import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, IconButton, Chip, Tooltip } from '@mui/material';
import { MemeResult } from '../types/meme';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { useMemeContext } from '../contexts/MemeContext';
import { calculateEngagementScore } from '../types/coin';
import toast from 'react-hot-toast';
import CoinCreator from './CoinCreator';

interface MemeDisplayProps {
  meme: MemeResult;
  compact?: boolean;
}

const MemeDisplay: React.FC<MemeDisplayProps> = ({ meme, compact = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [coinCreatorOpen, setCoinCreatorOpen] = useState(false);

  const {
    incrementViews,
    incrementLikes,
    incrementShares,
    incrementDownloads,
    updateMeme,
    simulateViralGrowth,
    trackEngagement,
  } = useMemeContext();

  // Track view when component mounts
  useEffect(() => {
    if (meme.id) {
      incrementViews(meme.id);
    }
  }, [meme.id, incrementViews]);

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

    console.log('Generated meme URL:', memeUrl);
    return memeUrl;
  };

  // Get the image URL with text overlay
  const getMemeImageUrl = () => {
    if (!meme || !meme.imageUrl) return '';

    // Use the image URL from the template (now updated with working URLs)
    let imageUrl = meme.imageUrl;

    // Ensure we have a valid URL
    if (!imageUrl.startsWith('http')) {
      // Fallback to a default image if the URL is invalid
      console.warn('Invalid image URL:', imageUrl);
      imageUrl = 'https://i.imgflip.com/30b1gx.jpg'; // Drake template as fallback
    }

    // Add text overlay using memegen.link API
    const finalUrl = addTextToMeme(imageUrl, meme.topText, meme.bottomText);

    console.log('Final meme URL with text:', {
      originalUrl: imageUrl,
      topText: meme.topText,
      bottomText: meme.bottomText,
      finalUrl
    });

    return finalUrl;
  };

  // Handle image loading errors
  const handleImageError = () => {
    console.error('Error loading meme image');
    setImageError(true);
  };

  // Handle like action
  const handleLike = () => {
    if (!liked && meme.id) {
      incrementLikes(meme.id);
      setLiked(true);
      toast.success('Meme liked! 👍');
    }
  };

  // Handle star action
  const handleStar = () => {
    setStarred(!starred);
    toast.success(starred ? 'Removed from favorites' : 'Added to favorites! ⭐');
  };

  // Handle share action
  const handleShare = async (platform?: string) => {
    if (meme.id) {
      incrementShares(meme.id, platform);

      if (navigator.share) {
        try {
          await navigator.share({
            title: `Check out this ${meme.templateName} meme!`,
            text: `${meme.topText || ''} ${meme.bottomText || ''}`,
            url: window.location.href,
          });
          trackEngagement(meme.id, 'share_native', { platform: 'native' });
        } catch (error) {
          // User cancelled sharing
        }
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
        trackEngagement(meme.id, 'share_clipboard', { platform: 'clipboard' });
      }
    }
  };

  // Handle viral growth simulation
  const handleViralGrowth = () => {
    if (meme.id) {
      simulateViralGrowth(meme.id);
      toast.success('🚀 Meme went viral! Check the new engagement numbers!');
    }
  };

  // Handle download action
  const handleDownload = async () => {
    if (meme.id) {
      incrementDownloads(meme.id);

      try {
        const imageUrl = getMemeImageUrl();
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${meme.templateName}-meme.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success('Meme downloaded! 📥');
      } catch (error) {
        toast.error('Failed to download meme');
      }
    }
  };

  // Handle copy action
  const handleCopy = async () => {
    try {
      const imageUrl = getMemeImageUrl();
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);

      toast.success('Meme copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy meme');
    }
  };

  // Get engagement score
  const engagementScore = meme.popularity ? calculateEngagementScore(meme.popularity) : 0;

  // Handle create coin action
  const handleCreateCoin = () => {
    setCoinCreatorOpen(true);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          paddingBottom: '75%', // 4:3 aspect ratio
          overflow: 'hidden',
          borderRadius: '4px',
          backgroundColor: '#fff',
          mb: 2
        }}
      >
        {!imageError ? (
          <img 
            src={getMemeImageUrl()}
            alt={`${meme.templateName} meme with text overlay`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'text.secondary'
          }}>
            Unable to load meme image
          </Box>
        )}
      </Box>
      
      {/* Popularity metrics */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {meme.popularity && (
          <>
            <Chip
              icon={<VisibilityIcon />}
              label={meme.popularity.views}
              size="small"
              variant="outlined"
            />
            <Chip
              icon={<ThumbUpIcon />}
              label={meme.popularity.likes}
              size="small"
              variant="outlined"
              color="primary"
            />
            <Chip
              icon={<ShareIcon />}
              label={meme.popularity.shares}
              size="small"
              variant="outlined"
              color="secondary"
            />
            {engagementScore > 0 && (
              <Chip
                label={`Score: ${engagementScore}`}
                size="small"
                color={meme.isEligibleForCoin ? 'success' : 'default'}
                variant={meme.isEligibleForCoin ? 'filled' : 'outlined'}
              />
            )}
          </>
        )}

        {meme.isEligibleForCoin && !meme.coinCreated && (
          <Chip
            icon={<CurrencyBitcoinIcon />}
            label="Coin Eligible!"
            size="small"
            color="warning"
            variant="filled"
            onClick={handleCreateCoin}
            sx={{ cursor: 'pointer' }}
          />
        )}

        {meme.coinCreated && (
          <Chip
            icon={<CurrencyBitcoinIcon />}
            label="Coin Created"
            size="small"
            color="success"
            variant="filled"
          />
        )}
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
        <Tooltip title="Download meme">
          <Button
            startIcon={<DownloadIcon />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleDownload}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Download
          </Button>
        </Tooltip>

        {/* Viral Growth Button for demo */}
        {!meme.isEligibleForCoin && (
          <Tooltip title="Simulate viral growth (Demo)">
            <Button
              size="small"
              variant="outlined"
              color="secondary"
              onClick={handleViralGrowth}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              🚀 Go Viral
            </Button>
          </Tooltip>
        )}

        <Tooltip title="Like this meme">
          <IconButton
            size="small"
            onClick={handleLike}
            disabled={liked}
            sx={{ color: liked ? '#f44336' : '#5c6bc0' }}
          >
            {liked ? <ThumbUpIcon fontSize="small" /> : <ThumbUpOutlinedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Share meme">
          <IconButton
            size="small"
            onClick={() => handleShare()}
            sx={{ color: '#5c6bc0' }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Copy to clipboard">
          <Button
            startIcon={<ContentCopyIcon />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={handleCopy}
            sx={{ borderRadius: '20px', textTransform: 'none' }}
          >
            Copy
          </Button>
        </Tooltip>

        <Tooltip title={starred ? "Remove from favorites" : "Add to favorites"}>
          <IconButton
            size="small"
            onClick={handleStar}
            sx={{ color: starred ? '#ffc107' : '#5c6bc0' }}
          >
            {starred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="caption" color="text.secondary" align="center">
        {meme.isEligibleForCoin
          ? "🎉 This meme is popular enough to become a coin!"
          : "Get more likes and shares to make this meme coin-eligible!"
        }
      </Typography>

      {/* Create Coin Button for eligible memes */}
      {meme.isEligibleForCoin && !meme.coinCreated && (
        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            startIcon={<CurrencyBitcoinIcon />}
            onClick={handleCreateCoin}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            }}
          >
            Create Coin from This Meme
          </Button>
        </Box>
      )}

      {/* Coin Creator Dialog */}
      <CoinCreator
        open={coinCreatorOpen}
        onClose={() => setCoinCreatorOpen(false)}
        meme={meme}
      />
    </Paper>
  );
};

export default MemeDisplay;
