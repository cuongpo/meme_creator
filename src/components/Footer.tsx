import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="#">
            Text-to-Meme Generator
          </Link>{' '}
          {new Date().getFullYear()}
          {'. Built as a Supermeme.ai clone.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
