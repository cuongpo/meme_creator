import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <EmojiEmotionsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Supermeme.ai Clone
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit">About</Button>
        <Button color="inherit">Examples</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
