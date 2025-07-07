import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { generateMeme } from '../api/memeApi';
import { MemeResult } from '../types/meme';
import MemeDisplay from './MemeDisplay';
import { useMemeContext } from '../contexts/MemeContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';

const MultiMemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [memes, setMemes] = useState<MemeResult[]>([]);
  const [error, setError] = useState('');
  // Fixed at 8 memes
  const count = 8;

  const { addMeme, getEligibleMemes, getTopMemes, getTotalEngagement } = useMemeContext();

  const categories = [
    'Programming',
    'Marketing',
    'Work',
    'School',
    'Social Media',
    'Life',
    'Relationships',
    'Finance',
    'All',
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a text prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    setMemes([]);
    
    try {
      // Generate multiple memes with unique templates
      const results = [];
      
      // Generate memes with unique templates
      
      // Generate memes sequentially with batch index
      for (let i = 0; i < count; i++) {
        const result = await generateMeme({
          prompt,
          category: category === 'All' ? undefined : category,
          language,
          resetTemplates: i === 0, // Only reset templates for the first request
          batchIndex: i // Send the batch index to ensure unique templates
        });

        // Add additional properties for coin system
        const enhancedResult: MemeResult = {
          ...result,
          category: category === 'All' ? undefined : category,
          language,
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

        results.push(enhancedResult);

        // Add to context for persistence and tracking
        addMeme(enhancedResult);
      }

      setMemes(results);
    } catch (err) {
      console.error('Error generating memes:', err);
      setError('Failed to generate memes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const eligibleMemes = getEligibleMemes();
  const topMemes = getTopMemes(5);
  const totalEngagement = getTotalEngagement();

  return (
    <Box>
      {/* Statistics Section */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            🚀 Meme Coin Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {eligibleMemes.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Coin-Eligible Memes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {totalEngagement}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Total Engagement Score
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {topMemes.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Trending Memes
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {eligibleMemes.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<CurrencyBitcoinIcon />}
                label={`${eligibleMemes.length} memes ready for coin creation!`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎨 Generate New Memes
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Text Prompt"
                  placeholder="e.g., When your code works on the first try"
                  variant="outlined"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  error={!!error}
                  helperText={error || 'Enter a short sentence, idea, or quote'}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={loading}
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Generate Memes'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Generating memes...
          </Typography>
        </Box>
      )}

      {/* Trending Memes Section */}
      {topMemes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            Trending Memes
          </Typography>
          <Grid container spacing={3}>
            {topMemes.slice(0, 4).map((meme, index) => (
              <Grid item xs={12} sm={6} key={meme.id || index}>
                <MemeDisplay meme={meme} compact={true} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Coin-Eligible Memes Section */}
      {eligibleMemes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyBitcoinIcon color="warning" />
            Coin-Eligible Memes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These memes have reached the popularity threshold and can be turned into valuable coins!
          </Typography>
          <Grid container spacing={3}>
            {eligibleMemes.slice(0, 4).map((meme, index) => (
              <Grid item xs={12} sm={6} key={meme.id || index}>
                <MemeDisplay meme={meme} compact={true} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {memes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            🎉 Your Latest Generated Memes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Share, like, and engage with these memes to make them coin-eligible!
          </Typography>
          <Grid container spacing={3}>
            {memes.map((meme, index) => (
              <Grid item xs={12} sm={6} key={meme.id || index}>
                <MemeDisplay meme={meme} compact={true} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default MultiMemeGenerator;
