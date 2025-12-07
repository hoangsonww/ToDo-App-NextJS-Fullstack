"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  LinearProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Refresh } from "@mui/icons-material";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import { getAppTheme } from "@/app/theme";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const router = useRouter();
  const theme = useMemo(() => getAppTheme(isDarkMode), [isDarkMode]);

  const fieldBaseSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: isDarkMode ? "#1a2f26" : "#ffffff",
    },
    "& .MuiInputBase-input": {
      color: isDarkMode ? "#ffffff" : theme.palette.text.primary,
      "&::placeholder": {
        color: isDarkMode ? "#ffffff" : "#4a5c55",
        opacity: 0.9,
      },
    },
    "& .MuiInputLabel-root": {
      color: isDarkMode ? "#e8f5ef" : theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: isDarkMode ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.18)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: isDarkMode ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.28)",
    },
    "& .MuiSvgIcon-root": {
      color: isDarkMode ? "#ffffff" : theme.palette.text.primary,
    },
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem("darkMode", JSON.stringify(next));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/auth/login");
  };

  useEffect(() => {
    const storedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    );
    setIsDarkMode(storedDarkMode);

    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setUser(data.user);
        router.push("/home");
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: isDarkMode
            ? "radial-gradient(circle at 20% 20%, #0a3d2c 0, #060f0b 35%, #040907 100%)"
            : "radial-gradient(circle at 12% 18%, #d9f2e5 0, #eef7f2 45%, #f5f8f6 100%)",
          color: isDarkMode ? "#e6f3ec" : "#0d2621",
          transition: "background 0.3s ease",
        }}
      >
        <NavBar
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={logout}
        />

        <Container maxWidth="md" sx={{ py: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: isDarkMode
                ? "linear-gradient(135deg, #0f3326, #0d5a3f)"
                : "linear-gradient(135deg, #0f8f5f, #0a6c45)",
              color: "#ffffff",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Welcome back to Flowlist
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Sign in to sync tasks, planner, focus sessions, and insights
                  across your devices.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Refresh />}
                    onClick={() => {
                      setUsername("");
                      setPassword("");
                    }}
                    sx={{ color: "#ffffff" }}
                  >
                    Clear form
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              backgroundColor: isDarkMode ? "#0f1f1a" : "#ffffff",
              border: "1px solid",
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Stack spacing={2} mb={2}>
              <Typography variant="h5" fontWeight={800}>
                Login
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Use your Flowlist credentials to continue. Need an account?{" "}
                <Link href="/auth/register">Register</Link>
              </Typography>
            </Stack>

            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Stack spacing={2}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                sx={fieldBaseSx}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                sx={fieldBaseSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={isLoading}
                sx={{ color: "#ffffff" }}
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </Stack>

            <Stack direction="row" justifyContent="space-between" mt={2}>
              <Link href="/auth/register">Create account</Link>
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </Stack>

            {isLoading && <LinearProgress sx={{ mt: 2 }} />}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
