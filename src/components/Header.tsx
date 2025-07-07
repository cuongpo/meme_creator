import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Chip } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ConnectKitButton } from 'connectkit';
import { useAccount, useChainId } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

interface HeaderProps {
  currentView: 'generator' | 'dashboard';
  onViewChange: (view: 'generator' | 'dashboard') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const getChainName = (chainId: number) => {
    switch (chainId) {
      case base.id:
        return 'Base';
      case baseSepolia.id:
        return 'Base Sepolia';
      default:
        return 'Unknown';
    }
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Box display="flex" alignItems="center">
          <CurrencyBitcoinIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Meme Coin Creator
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Chain indicator */}
        {isConnected && (
          <Chip
            label={getChainName(chainId)}
            size="small"
            variant="outlined"
            sx={{
              mr: 2,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              '& .MuiChip-label': { color: 'white' }
            }}
          />
        )}

        {/* Navigation Buttons */}
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          variant={currentView === 'generator' ? 'outlined' : 'text'}
          startIcon={<EmojiEmotionsIcon />}
          onClick={() => onViewChange('generator')}
        >
          Generator
        </Button>
        <Button
          color="inherit"
          sx={{ mr: 2 }}
          variant={currentView === 'dashboard' ? 'outlined' : 'text'}
          startIcon={<DashboardIcon />}
          onClick={() => onViewChange('dashboard')}
        >
          Dashboard
        </Button>

        {/* Wallet Connect Button */}
        <ConnectKitButton />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
