"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import "../../page.css";
import Link from "next/link";

const darkGreenTheme = createTheme({
  palette: {
    primary: {
      main: "#006400", // Dark green
    },
    secondary: {
      main: "#ffffff", // White
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

interface User {
  id: number;
  username: string;
  password: string;
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/auth/login");
  };

  const handleLogin = () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    const existingUsers: User[] = JSON.parse(
      localStorage.getItem("users") || "[]",
    );

    const user = existingUsers.find(
      (user) => user.username === username && user.password === password,
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // Store user session in localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Login successful!");
    router.push("/");
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
  };

  useEffect(() => {
    const storedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    );
    setIsDarkMode(storedDarkMode);
  }, []);

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: isDarkMode ? "#000000" : "#ffffff", // Background color
          color: isDarkMode ? "#ffffff" : "#000000", // Text color
        }}
      >
        {/* Navbar */}
        <AppBar position="sticky" sx={{ backgroundColor: "#006400" }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>
                The NextJS ToDo App
              </Link>
            </Typography>

            {/* Navbar Links with Active and Hover Underline Effect */}
            <Link href="/" passHref>
              <Button
                sx={{
                  color: isActive("/") ? "#f5f5f5" : "#ffffff",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: isActive("/") ? "100%" : "0",
                    backgroundColor: "#ffffff",
                    borderRadius: isActive("/") ? "10px" : "0", // Rounded border for active link
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Home
              </Button>
            </Link>

            {/* Conditional Login/Logout Button */}
            {user ? (
              <Button
                onClick={logout}
                sx={{
                  color: "red",
                  fontWeight: "bold",
                  position: "relative",
                  "&:hover": {
                    color: "#ff4d4d",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: "0",
                    backgroundColor: "#fff",
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <Link href="/auth/login" passHref>
                <Button
                  sx={{
                    color: isActive("/auth/login") ? "#f5f5f5" : "#ffffff",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      height: "2px",
                      width: isActive("/auth/login") ? "100%" : "0",
                      backgroundColor: "#ffffff",
                      borderRadius: isActive("/auth/login") ? "10px" : "0",
                      transition: "width 0.3s",
                    },
                    "&:hover::after": {
                      width: "100%",
                    },
                  }}
                >
                  Login
                </Button>
              </Link>
            )}

            <Link href="/auth/register" passHref>
              <Button
                sx={{
                  color: isActive("/auth/register") ? "#f5f5f5" : "#ffffff",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: isActive("/auth/register") ? "100%" : "0",
                    backgroundColor: "#ffffff",
                    borderRadius: isActive("/auth/register") ? "10px" : "0",
                    transition: "width 0.3s",
                  },
                  "&:hover::after": {
                    width: "100%",
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

        {/* Login Form */}
        <Container
          sx={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={4}
            sx={{
              padding: "30px",
              borderRadius: 2,
              boxShadow: 3,
              width: "100%",
              maxWidth: "400px",
              backgroundColor: isDarkMode ? "#333" : "#fff", // Modal's background color
              color: isDarkMode ? "#fff" : "#000", // Text color
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Login
            </Typography>
            {error && (
              <Typography color="error" align="center">
                {error}
              </Typography>
            )}
            <Box mb={2}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  marginBottom: 2,
                  "& .MuiInputBase-input": {
                    color: isDarkMode ? "#fff" : "#000",
                  },
                  "& .MuiInputLabel-root": {
                    color: isDarkMode ? "#fff" : "#000",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: isDarkMode ? "#fff" : "#000",
                    },
                    "&:hover fieldset": {
                      borderColor: isDarkMode ? "#bbb" : "#000",
                    },
                  },
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
                InputProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
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
                  "& .MuiInputBase-input": {
                    color: isDarkMode ? "#fff" : "#000",
                  },
                  "& .MuiInputLabel-root": {
                    color: isDarkMode ? "#fff" : "#000",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: isDarkMode ? "#fff" : "#000",
                    },
                    "&:hover fieldset": {
                      borderColor: isDarkMode ? "#bbb" : "#000",
                    },
                  },
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
                InputProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                backgroundColor: darkGreenTheme.palette.primary.main,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#004d00", // Darker green on hover
                },
              }}
            >
              Login
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don&#39;t have an account?{" "}
              <a
                href="/auth/register"
                style={{ color: darkGreenTheme.palette.primary.main }}
              >
                Register
              </a>
            </Typography>
          </Paper>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            textAlign: "center",
            py: 2,
            backgroundColor: darkGreenTheme.palette.primary.main,
            color: "#ffffff",
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} ToDo App. All Rights Reserved.
          </Typography>
        </Box>
      </div>
    </ThemeProvider>
  );
}
