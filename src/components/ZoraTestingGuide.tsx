import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Button,
  Link,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import TestTubeIcon from '@mui/icons-material/Science';

const ZoraTestingGuide: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>('requirements');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TestTubeIcon color="primary" />
        Zora Coinathon Testing Guide
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete guide to test your meme coins according to Zora Coinathon requirements
      </Typography>

      <Accordion expanded={expanded === 'requirements'} onChange={handleChange('requirements')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">📋 Coinathon Requirements</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="1. Build on Coins"
                secondary="✅ Your project uses @zoralabs/coins-sdk"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="2. Deploy on Base Networks Only"
                secondary="✅ Configured for Base Mainnet (8453) and Base Sepolia (84532)"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="3. Test Using Required Format"
                secondary="✅ testnet.zora.co/coin/bsep:[token_address] for Base Sepolia"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'testing'} onChange={handleChange('testing')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">🧪 Testing Your Coins</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Required Testing Format:</strong> testnet.zora.co/coin/bsep:[token_address]
            </Typography>
          </Alert>
          
          <Typography variant="subtitle1" gutterBottom>
            Step-by-Step Testing Process:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText
                primary="1. Switch to Base Sepolia"
                secondary="Use the network switcher above to connect to Base Sepolia testnet"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Create a Meme"
                secondary="Generate a meme and make it popular (use 🚀 Go Viral for demo)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Create Coin"
                secondary="Once eligible, create a coin from your popular meme"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Test on Zora"
                secondary="Click the 'Test on Zora' button to open testnet.zora.co with your coin"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="5. Verify Functionality"
                secondary="Ensure your coin appears correctly and can be traded on Zora"
              />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'networks'} onChange={handleChange('networks')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">🌐 Supported Networks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Base Sepolia (Testnet) - Recommended for Testing
              </Typography>
              <Chip label="Chain ID: 84532" size="small" sx={{ mr: 1 }} />
              <Chip label="Currency: ETH" size="small" sx={{ mr: 1 }} />
              <Chip label="Test Format: testnet.zora.co/coin/bsep:[address]" size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Perfect for testing your coins before mainnet deployment
              </Typography>
            </Box>
            
            <Divider />
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Base Mainnet - Production
              </Typography>
              <Chip label="Chain ID: 8453" size="small" sx={{ mr: 1 }} />
              <Chip label="Currency: ZORA" size="small" sx={{ mr: 1 }} />
              <Chip label="Format: zora.co/coin/base:[address]" size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                For production deployment of your coins
              </Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={expanded === 'troubleshooting'} onChange={handleChange('troubleshooting')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">🔧 Troubleshooting</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle1" gutterBottom>
            Common Issues and Solutions:
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemText
                primary="Wrong Network"
                secondary="Make sure you're connected to Base Sepolia (84532) for testing"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Insufficient Gas"
                secondary="Ensure you have enough ETH for transaction fees"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Meme Not Eligible"
                secondary="Increase engagement (likes, shares, views) to make meme coin-eligible"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Transaction Failed"
                secondary="Check network connection and try again with higher gas limit"
              />
            </ListItem>
          </List>
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Need Help?</strong> Join the Zora Discord or check the documentation for support.
            </Typography>
          </Alert>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<LaunchIcon />}
          href="https://testnet.zora.co"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zora Testnet
        </Button>
        <Button
          variant="outlined"
          startIcon={<CodeIcon />}
          href="https://docs.zora.co/coins"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zora Docs
        </Button>
        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          href="https://github.com/ourzora/zora-protocol"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Button>
      </Box>
    </Paper>
  );
};

export default ZoraTestingGuide;
