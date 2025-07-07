import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography } from '@mui/material';
import MultiMemeGenerator from './components/MultiMemeGenerator';
import CoinDashboard from './components/CoinDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { MemeProvider } from './contexts/MemeContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'generator' | 'dashboard'>('generator');

  const renderContent = () => {
    switch (currentView) {
      case 'generator':
        return (
          <>
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              sx={{ mb: 4, fontWeight: 'bold' }}
            >
              Meme Coin Creator
            </Typography>
            <Typography
              variant="subtitle1"
              align="center"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Create memes and turn popular ones into valuable coins on Zora
            </Typography>
            <MultiMemeGenerator />
          </>
        );
      case 'dashboard':
        return <CoinDashboard />;
      default:
        return <MultiMemeGenerator />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MemeProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header currentView={currentView} onViewChange={setCurrentView} />
          <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
            {renderContent()}
          </Container>
          <Footer />
        </Box>
      </MemeProvider>
    </ThemeProvider>
  );
}

export default App;
