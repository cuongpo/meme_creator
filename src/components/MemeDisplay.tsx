import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { MemeResult } from '../types/meme';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface MemeDisplayProps {
  meme: MemeResult;
  compact?: boolean;
}

const MemeDisplay: React.FC<MemeDisplayProps> = ({ meme, compact = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Function to add text to the meme image
  const addTextToMeme = (imageUrl: string, topText?: string, bottomText?: string) => {
    // Create the full meme URL with text parameters
    const baseUrl = 'https://api.memegen.link/images/custom';
    
    // Extract the image filename from the URL
    const imageFilename = imageUrl.split('/').pop() || '';
    
    // URL encode the texts
    const topTextEncoded = topText ? encodeURIComponent(topText) : '_';
    const bottomTextEncoded = bottomText ? encodeURIComponent(bottomText) : '_';
    
    // Construct the URL with the text and high quality parameters
    return `${baseUrl}/${topTextEncoded}/${bottomTextEncoded}.png?background=${encodeURIComponent(imageUrl)}&width=1200&height=1200&quality=100`;
  };

  // Get the image URL with text overlay
  const getMemeImageUrl = () => {
    if (!meme || !meme.imageUrl) return '';
    
    // Clean up the URL to get the highest resolution version
    let highQualityUrl = meme.imageUrl;
    
    // Remove any '/4/' path segments which indicate lower quality on imgflip
    if (highQualityUrl.includes('imgflip.com')) {
      // Remove any path segments that indicate lower quality
      highQualityUrl = highQualityUrl.replace('/4/', '/');
      
      // Ensure we're using the direct image URL without any size restrictions
      if (!highQualityUrl.includes('.jpg') && !highQualityUrl.includes('.png')) {
        highQualityUrl = `${highQualityUrl}.jpg`;
      }
    }
    
    // For some popular memes, use known high-resolution sources
    if (meme.templateId === 'drake') {
      highQualityUrl = 'https://i.imgflip.com/30b1gx.jpg';
    } else if (meme.templateId === 'distracted-boyfriend') {
      highQualityUrl = 'https://i.imgflip.com/1ur9b.jpg';
    } else if (meme.templateId === 'success-kid') {
      highQualityUrl = 'https://i.imgflip.com/1bhk.jpg';
    }
    
    // Add text overlay using memegen.link API with high quality settings
    return addTextToMeme(highQualityUrl, meme.topText, meme.bottomText);
  };

  // Handle image loading errors
  const handleImageError = () => {
    console.error('Error loading meme image');
    setImageError(true);
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
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Button 
          startIcon={<DownloadIcon />} 
          size="small" 
          variant="outlined" 
          color="primary"
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Download
        </Button>
        
        <IconButton size="small" sx={{ color: '#5c6bc0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon fontSize="small" />
          </Box>
        </IconButton>
        
        <Button 
          startIcon={<ContentCopyIcon />} 
          size="small" 
          variant="outlined" 
          color="primary"
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Copy
        </Button>
        
        <IconButton size="small" sx={{ color: '#5c6bc0' }}>
          <StarBorderIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Typography variant="caption" color="text.secondary" align="center">
        Drag and drop meme text to change text position and size
      </Typography>
    </Paper>
  );
};

export default MemeDisplay;
