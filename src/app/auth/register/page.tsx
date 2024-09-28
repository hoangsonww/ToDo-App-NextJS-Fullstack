'use client';
import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Paper,
  Button,
  TextField,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import Link from 'next/link';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import '../../page.css';

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

interface User {
  id: number;
  username: string;
  password: string;
}

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Retrieve existing users from localStorage and cast them to the User array type
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user already exists
    if (existingUsers.some((user) => user.username === username)) {
      setError('User already exists');
      return;
    }

    // Register the user with the User type
    const newUser: User = { id: existingUsers.length + 1, username, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('User registered successfully! Please log in.');
    router.push('/auth/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'true');
    setIsDarkMode(storedDarkMode);
  }, []);

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: isDarkMode ? '#000000' : '#ffffff', // Background color
          color: isDarkMode ? '#ffffff' : '#000000', // Text color
        }}
      >
        {/* Navbar */}
        <AppBar position="sticky" sx={{ backgroundColor: '#006400' }}>
          <Toolbar>
            {/* App Title that redirects to Home */}
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
                The NextJS ToDo App
              </Link>
            </Typography>

            {/* Navbar Links with Active State Highlight */}
            <Link href="/" passHref>
              <Button
                sx={{
                  color: isActive('/') ? '#f5f5f5' : '#ffffff',
                  position: 'relative',
                  '&::after': isActive('/')
                    ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: '3px',
                      width: '100%', // Full width underline
                      backgroundColor: '#f5f5f5',
                      borderRadius: '10px', // Rounded corners on both sides
                      transition: 'width 0.3s',
                    }
                    : {},
                  '&:hover::after': {
                    width: '110%', // Slightly larger on hover
                  },
                }}
              >
                Home
              </Button>
            </Link>
            <Link href="/auth/login" passHref>
              <Button
                sx={{
                  color: isActive('/auth/login') ? '#f5f5f5' : '#ffffff',
                  position: 'relative',
                  '&::after': isActive('/auth/login')
                    ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: '3px',
                      width: '100%', // Full width underline
                      backgroundColor: '#f5f5f5',
                      borderRadius: '10px', // Rounded corners on both sides
                      transition: 'width 0.3s',
                    }
                    : {},
                  '&:hover::after': {
                    width: '110%', // Slightly larger on hover
                  },
                }}
              >
                Login
              </Button>
            </Link>
            <Link href="/auth/register" passHref>
              <Button
                sx={{
                  color: isActive('/auth/register') ? '#f5f5f5' : '#ffffff',
                  position: 'relative',
                  '&::after': isActive('/auth/register')
                    ? {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: '3px',
                      width: '100%', // Full width underline
                      backgroundColor: '#f5f5f5',
                      borderRadius: '10px', // Rounded corners on both sides
                      transition: 'width 0.3s',
                    }
                    : {},
                  '&:hover::after': {
                    width: '110%', // Slightly larger on hover
                  },
                }}
              >
                Register
              </Button>
            </Link>

            {/* Dark Mode Toggle */}
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Register Form */}
        <Container
          sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            elevation={4}
            sx={{
              padding: '30px',
              borderRadius: 2,
              boxShadow: 3,
              width: '100%',
              maxWidth: '400px',
              backgroundColor: isDarkMode ? '#333' : '#fff', // Modal's background color
              color: isDarkMode ? '#fff' : '#000', // Text color
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Register
            </Typography>
            {error && <Typography color="error" align="center">{error}</Typography>}
            <Box mb={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  marginBottom: 2,
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#bbb' : '#000',
                    },
                  },
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#fff' : '#000' },
                }}
                InputProps={{
                  style: { color: isDarkMode ? '#fff' : '#000' },
                }}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  marginBottom: 2,
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#bbb' : '#000',
                    },
                  },
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#fff' : '#000' },
                }}
                InputProps={{
                  style: { color: isDarkMode ? '#fff' : '#000' },
                }}
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{
                  marginBottom: 2,
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#fff' : '#000',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#fff' : '#000',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#bbb' : '#000',
                    },
                  },
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? '#fff' : '#000' },
                }}
                InputProps={{
                  style: { color: isDarkMode ? '#fff' : '#000' },
                }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              sx={{
                backgroundColor: darkGreenTheme.palette.primary.main,
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#004d00', // Darker green on hover
                },
              }}
            >
              Register
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account? <a href="/auth/login" style={{ color: darkGreenTheme.palette.primary.main }}>Login</a>
            </Typography>
          </Paper>
        </Container>

        {/* Footer */}
        <Box sx={{ mt: 'auto', textAlign: 'center', py: 2, backgroundColor: darkGreenTheme.palette.primary.main, color: '#ffffff' }}>
          <Typography variant="body2">&copy; {new Date().getFullYear()} ToDo App. All Rights Reserved.</Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
}
