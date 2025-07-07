import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Tab,
  Tabs,
  Paper,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useAccount } from 'wagmi';
import { useMemeContext } from '../contexts/MemeContext';
import MemeDisplay from './MemeDisplay';
import CoinCreator from './CoinCreator';
import NetworkSwitcher from './NetworkSwitcher';
import ZoraTestingGuide from './ZoraTestingGuide';
import { MemeResult } from '../types/meme';
import { calculateEngagementScore, COIN_ELIGIBILITY_THRESHOLDS } from '../types/coin';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`coin-tabpanel-${index}`}
      aria-labelledby={`coin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CoinDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedMeme, setSelectedMeme] = useState<MemeResult | null>(null);
  const [coinCreatorOpen, setCoinCreatorOpen] = useState(false);

  const { isConnected } = useAccount();
  const { getEligibleMemes, getTopMemes, memes } = useMemeContext();

  const eligibleMemes = getEligibleMemes();
  const topMemes = getTopMemes(10);
  const createdCoins = memes.filter(meme => meme.coinCreated);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateCoin = (meme: MemeResult) => {
    setSelectedMeme(meme);
    setCoinCreatorOpen(true);
  };

  const getProgressToEligibility = (meme: MemeResult) => {
    if (!meme.popularity) return 0;
    
    const score = calculateEngagementScore(meme.popularity);
    const progress = Math.min(100, (score / COIN_ELIGIBILITY_THRESHOLDS.minEngagementScore) * 100);
    return progress;
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CurrencyBitcoinIcon fontSize="large" />
          Coin Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Manage your meme coins and track popularity metrics
        </Typography>
      </Paper>

      {/* Connection Alert */}
      {!isConnected && (
        <Alert severity="info" sx={{ mb: 3 }} icon={<AccountBalanceWalletIcon />}>
          Connect your wallet to create coins from your popular memes
        </Alert>
      )}

      {/* Network Switcher */}
      <NetworkSwitcher />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CurrencyBitcoinIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {eligibleMemes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coin-Eligible Memes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {createdCoins.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coins Created
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary.main">
                {topMemes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trending Memes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Zora Testing Guide */}
      <ZoraTestingGuide />

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="coin dashboard tabs">
          <Tab label={`Coin-Eligible (${eligibleMemes.length})`} />
          <Tab label={`Created Coins (${createdCoins.length})`} />
          <Tab label={`Trending (${topMemes.length})`} />
          <Tab label="All Memes" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>
          🎉 Memes Ready for Coin Creation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          These memes have reached the popularity threshold and can be turned into valuable coins!
        </Typography>
        
        {eligibleMemes.length === 0 ? (
          <Alert severity="info">
            No memes are currently eligible for coin creation. Keep sharing and engaging with memes to make them eligible!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {eligibleMemes.map((meme, index) => (
              <Grid item xs={12} sm={6} md={4} key={meme.id || index}>
                <MemeDisplay meme={meme} compact={true} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          💰 Your Created Coins
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Memes that have been successfully turned into coins
        </Typography>
        
        {createdCoins.length === 0 ? (
          <Alert severity="info">
            You haven't created any coins yet. Create coins from your popular memes to start earning!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {createdCoins.map((meme, index) => (
              <Grid item xs={12} sm={6} md={4} key={meme.id || index}>
                <MemeDisplay meme={meme} compact={true} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          📈 Trending Memes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Most popular memes based on engagement score
        </Typography>
        
        {topMemes.length === 0 ? (
          <Alert severity="info">
            No trending memes yet. Create and share memes to see them here!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {topMemes.map((meme, index) => (
              <Grid item xs={12} sm={6} md={4} key={meme.id || index}>
                <MemeDisplay meme={meme} compact={true} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>
          🎨 All Your Memes
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Complete collection of your created memes with progress tracking
        </Typography>
        
        {memes.length === 0 ? (
          <Alert severity="info">
            No memes created yet. Go to the generator to create your first meme!
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {memes.map((meme, index) => (
              <Grid item xs={12} sm={6} md={4} key={meme.id || index}>
                <Card>
                  <MemeDisplay meme={meme} compact={true} />
                  {!meme.isEligibleForCoin && (
                    <CardContent>
                      <Typography variant="body2" gutterBottom>
                        Progress to coin eligibility:
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={getProgressToEligibility(meme)} 
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(getProgressToEligibility(meme))}% complete
                      </Typography>
                    </CardContent>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Coin Creator Dialog */}
      <CoinCreator
        open={coinCreatorOpen}
        onClose={() => setCoinCreatorOpen(false)}
        meme={selectedMeme}
      />
    </Box>
  );
};

export default CoinDashboard;
