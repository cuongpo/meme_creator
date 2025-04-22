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
} from '@mui/material';
import { generateMeme } from '../api/memeApi';
import { MemeResult } from '../types/meme';
import MemeDisplay from './MemeDisplay';

const MultiMemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [memes, setMemes] = useState<MemeResult[]>([]);
  const [error, setError] = useState('');
  // Fixed at 8 memes
  const count = 8;

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
        
        results.push(result);
      }
      
      setMemes(results);
    } catch (err) {
      console.error('Error generating memes:', err);
      setError('Failed to generate memes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generate Multiple Memes
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

      {memes.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Generated Memes
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
