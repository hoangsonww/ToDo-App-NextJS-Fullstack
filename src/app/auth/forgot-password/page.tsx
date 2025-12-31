"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Refresh,
  LockReset,
} from "@mui/icons-material";
import Link from "next/link";
import NavBar from "@/app/components/NavBar";
import { getAppTheme } from "@/app/theme";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleVerifyUsername = async () => {
    if (!username.trim()) {
      setError("Enter the username associated with your account");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        setError("");
      } else {
        setError(data.error || "Username verification failed.");
      }
    } catch {
      setError("Unexpected error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError("Fill out both password fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword: password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Password reset successful!");
        router.push("/auth/login");
      } else {
        setError(data.error || "Password reset failed.");
      }
    } catch {
      setError("Unexpected error. Try again.");
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
            <Stack direction="row" spacing={1} alignItems="center">
              <LockReset />
              <Typography variant="h5" fontWeight={800}>
                Recover access
              </Typography>
            </Stack>
            <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
              Enter your username to verify ownership, then set a new password.
            </Typography>
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
                {step === 1 ? "Verify your username" : "Reset password"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {step === 1
                  ? "We will confirm your account and move to password reset."
                  : "Choose a new password and confirm it below."}
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
                sx={fieldBaseSx}
                disabled={step === 2}
              />
              {step === 2 && (
                <>
                  <TextField
                    label="New password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <TextField
                    label="Confirm password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={fieldBaseSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={
                  step === 1 ? handleVerifyUsername : handleResetPassword
                }
                disabled={isLoading}
                sx={{ color: "#ffffff" }}
              >
                {step === 1 ? "Verify username" : "Set new password"}
              </Button>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              mt={2}
              alignItems="center"
            >
              <Link href="/auth/login">Back to login</Link>
              <Link href="/auth/register">Create account</Link>
            </Stack>

            {isLoading && <LinearProgress sx={{ mt: 2 }} />}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
