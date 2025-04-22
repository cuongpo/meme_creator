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
  Paper,
} from '@mui/material';
import { generateMeme } from '../api/memeApi';
import { MemeResult } from '../types/meme';
import MemeDisplay from './MemeDisplay';

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

const MemeGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('All');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [meme, setMeme] = useState<MemeResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a text prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await generateMeme({
        prompt,
        category: category === 'All' ? undefined : category,
        language,
      });
      
      setMeme(result);
    } catch (err) {
      console.error('Error generating meme:', err);
      setError('Failed to generate meme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Enter your meme idea
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
                    'Generate Meme'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {meme && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Generated Meme
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <MemeDisplay meme={meme} />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  // In a real app, this would download the canvas as an image
                  alert('Download functionality would be implemented here');
                }}
              >
                Download
              </Button>
              <Button 
                variant="outlined"
                onClick={() => {
                  // In a real app, this would open share options
                  alert('Share functionality would be implemented here');
                }}
              >
                Share
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                onClick={() => setPrompt('')}
              >
                Generate New
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default MemeGenerator;
