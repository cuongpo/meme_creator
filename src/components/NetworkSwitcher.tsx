import React from 'react';
import {
  Box,
  Button,
  Chip,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { ZORA_CONFIG } from '../config/wagmi';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const NetworkSwitcher: React.FC = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) {
    return null;
  }

  const isSupported = ZORA_CONFIG.supportedChains.includes(chainId as any);
  const currentChain = chainId === base.id ? base : chainId === baseSepolia.id ? baseSepolia : null;

  const handleSwitchToBase = () => {
    switchChain({ chainId: base.id });
  };

  const handleSwitchToBaseSepolia = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SwapHorizIcon />
        Network Selection
      </Typography>

      {isSupported ? (
        <Alert severity="success" sx={{ mb: 2 }} icon={<CheckCircleIcon />}>
          <Typography variant="body2">
            ✅ Connected to {currentChain?.name} - Perfect for Zora coins!
          </Typography>
          {chainId === baseSepolia.id && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              🧪 Test your coins at: testnet.zora.co/coin/bsep:[token_address]
            </Typography>
          )}
          {chainId === base.id && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              🚀 Production coins at: zora.co/coin/base:[token_address]
            </Typography>
          )}
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <Typography variant="body2">
            ⚠️ Please switch to a supported network to create Zora coins
          </Typography>
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant={chainId === baseSepolia.id ? "contained" : "outlined"}
          color={chainId === baseSepolia.id ? "success" : "primary"}
          onClick={handleSwitchToBaseSepolia}
          disabled={isPending || chainId === baseSepolia.id}
          startIcon={chainId === baseSepolia.id ? <CheckCircleIcon /> : <SwapHorizIcon />}
          sx={{ minWidth: 160 }}
        >
          {chainId === baseSepolia.id ? 'Connected' : 'Switch to'} Base Sepolia
        </Button>

        <Button
          variant={chainId === base.id ? "contained" : "outlined"}
          color={chainId === base.id ? "success" : "primary"}
          onClick={handleSwitchToBase}
          disabled={isPending || chainId === base.id}
          startIcon={chainId === base.id ? <CheckCircleIcon /> : <SwapHorizIcon />}
          sx={{ minWidth: 160 }}
        >
          {chainId === base.id ? 'Connected' : 'Switch to'} Base Mainnet
        </Button>
      </Box>

      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={`Current: ${currentChain?.name || 'Unknown'}`}
          color={isSupported ? 'success' : 'error'}
          size="small"
        />
        <Chip
          label={`Chain ID: ${chainId}`}
          variant="outlined"
          size="small"
        />
        {isPending && (
          <Chip
            label="Switching..."
            color="warning"
            size="small"
          />
        )}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        💡 Tip: Use Base Sepolia for testing, Base Mainnet for production coins
      </Typography>
    </Paper>
  );
};

export default NetworkSwitcher;
