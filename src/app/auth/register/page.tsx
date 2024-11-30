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
  InputAdornment,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress
} from "@mui/material";
import Link from "next/link";
import { Brightness4, Brightness7, Visibility, VisibilityOff } from "@mui/icons-material";
import "../../page.css";

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

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );

  // Load dark mode from localStorage
  useEffect(() => {
    const storedDarkMode = JSON.parse(localStorage.getItem("darkMode") || "false");
    setIsDarkMode(storedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async () => {
    setIsLoading(true);

    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        router.push("/auth/login");
      } else {
        setError(data.error || "Registration failed");
      }

      setIsLoading(false);
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    router.push("/auth/login");
  };

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
                    borderRadius: isActive("/") ? "10px" : "0",
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

        {/* Register Form */}
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
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Register
            </Typography>
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
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
                sx={{ marginBottom: 2 }}
                InputLabelProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
                InputProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ?
                          <VisibilityOff sx={{ color: isDarkMode ? "#fff" : "#000" }}/> :
                          <Visibility sx={{ color: isDarkMode ? "#fff" : "#000" }}/>
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleRegister()}
                sx={{ marginBottom: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ?
                          <VisibilityOff sx={{ color: isDarkMode ? "#fff" : "#000" }}/> :
                          <Visibility sx={{ color: isDarkMode ? "#fff" : "#000" }}/>
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? "#fff" : "#000" },
                }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              sx={{
                backgroundColor: darkGreenTheme.palette.primary.main,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#004d00",
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Register"
              )}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <a
                href="/auth/login"
                style={{ color: darkGreenTheme.palette.primary.main }}
              >
                Login
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
