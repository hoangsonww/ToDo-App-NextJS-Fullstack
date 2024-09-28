// src/app/page.tsx
'use client';
import React, {useEffect, useState} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
  Grid,
} from '@mui/material';
import '../page.css';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import Link from 'next/link';

const darkGreenTheme = createTheme({
  palette: {
    primary: {
      main: '#006400', // Dark green
    },
    secondary: {
      main: '#ffffff', // White
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const prefersDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'true');
    setIsDarkMode(prefersDarkMode);
  }, []);

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#000000',
        }}
      >
        {/* Navbar */}
        <AppBar position="sticky" sx={{ backgroundColor: darkGreenTheme.palette.primary.main }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
                The NextJS ToDo App
              </Link>
            </Typography>
            <Link href="/auth/login" passHref>
              <Button
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  '&:hover': { borderBottom: '2px solid #ffffff', borderRadius: '10px' },
                }}
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register" passHref>
              <Button
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  '&:hover': { borderBottom: '2px solid #ffffff', borderRadius: '10px' },
                }}
              >
                Register
              </Button>
            </Link>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '50px 20px',
            backgroundColor: isDarkMode ? '#222' : '#f9f9f9',
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          <Container>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Welcome to the NextJS To-Do App
            </Typography>
            <Typography variant="h6" gutterBottom>
              Organize your tasks, increase your productivity, and manage your to-dos effortlessly with our simple and
              intuitive app.
            </Typography>
            <Link href="/auth/register" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: darkGreenTheme.palette.primary.main,
                  color: '#fff',
                  mt: 3,
                  '&:hover': { backgroundColor: '#004d00' },
                }}
              >
                Get Started
              </Button>
            </Link>
          </Container>
        </Box>

        {/* Features Section */}
        <Container sx={{ py: 8 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  color: isDarkMode ? '#fff' : '#000',
                  textAlign: 'center',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography variant="body2">
                  Our app is designed with simplicity in mind. Easily manage your tasks with a clean and intuitive
                  interface.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  color: isDarkMode ? '#fff' : '#000',
                  textAlign: 'center',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Stay Organized
                </Typography>
                <Typography variant="body2">
                  Keep track of your tasks, categorize them, and stay organized. Never miss an important task again.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: isDarkMode ? '#333' : '#fff',
                  color: isDarkMode ? '#fff' : '#000',
                  textAlign: 'center',
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Dark Mode Support
                </Typography>
                <Typography variant="body2">
                  Enjoy using the app in both light and dark modes. Switch between modes for a more comfortable
                  experience.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Call-to-Action Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 4,
            backgroundColor: isDarkMode ? '#444' : '#e8e8e8',
            color: isDarkMode ? '#fff' : '#000',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Ready to become more organized and productive?
          </Typography>
          <Link href="/auth/register" passHref>
            <Button
              variant="contained"
              sx={{
                backgroundColor: darkGreenTheme.palette.primary.main,
                color: '#fff',
                mt: 2,
                '&:hover': { backgroundColor: '#004d00' },
              }}
            >
              Start Your Journey
            </Button>
          </Link>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 'auto', textAlign: 'center', py: 2, backgroundColor: darkGreenTheme.palette.primary.main, color: '#ffffff' }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} ToDo App. All Rights Reserved.</Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
}
