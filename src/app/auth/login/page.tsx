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
  List,
  ListItem,
  ListItemButton,
  Drawer,
  ListItemText,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Visibility,
  VisibilityOff,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Link from "next/link";
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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );

  useEffect(() => {
    const storedDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "false",
    );
    setIsDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  const drawer = (
    <Box
      sx={{
        width: 250,
        bgcolor: isDarkMode ? "#333" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
        height: "100%",
        transition: "all 0.3s ease",
      }}
    >
      <IconButton
        onClick={handleDrawerToggle}
        sx={{ color: isDarkMode ? "#fff" : "#000", m: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/" onClick={handleDrawerToggle}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        {user ? (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                logout();
                handleDrawerToggle();
              }}
            >
              <ListItemText primary="Logout" sx={{ color: "red" }} />
            </ListItemButton>
          </ListItem>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href="/auth/login"
                onClick={handleDrawerToggle}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        <ListItem disablePadding>
          <ListItemButton
            component="a"
            href="/auth/register"
            onClick={handleDrawerToggle}
          >
            <ListItemText primary="Register" />
          </ListItemButton>
        </ListItem>

        {/* Divider */}
        <div
          style={{
            borderTop: isDarkMode ? "1px solid #fff" : "1px solid #333",
            marginTop: 2,
            marginBottom: 2,
          }}
        ></div>

        {/* Dark mode toggle */}
        <ListItem disablePadding>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            px={2}
            sx={{ mt: 0.5 }}
          >
            <Typography sx={{ color: isDarkMode ? "#fff" : "#000" }}>
              Dark Mode
            </Typography>
            <IconButton onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Brightness7 sx={{ color: "#fff" }} />
              ) : (
                <Brightness4 sx={{ color: "#000" }} />
              )}
            </IconButton>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        alert(data.message);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        setUser(data.user);
        router.push("/");
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

  const logout = () => {
    localStorage.removeItem("currentUser");
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
          backgroundColor: isDarkMode ? "#000000" : "#ffffff",
          color: isDarkMode ? "#ffffff" : "#000000",
          transition: "all 0.3s ease",
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

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
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
                      borderRadius: "10px",
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
                <>
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
                          borderRadius: "10px",
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
                </>
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
                      borderRadius: "10px",
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

              <IconButton color="inherit" onClick={toggleDarkMode}>
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            {/* Mobile Navigation */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "block", md: "none" },
                textAlign: "center",
                width: "50px",
                height: "50px",
              }}
            >
              <MenuIcon sx={{ mt: "5px" }} />
            </IconButton>
          </Toolbar>

          {/* Drawer for Mobile */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
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
              backgroundColor: isDarkMode ? "#333" : "#fff",
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Login
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
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
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
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ color: isDarkMode ? "#fff" : "#000" }}
                          />
                        ) : (
                          <Visibility
                            sx={{ color: isDarkMode ? "#fff" : "#000" }}
                          />
                        )}
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
              onClick={handleLogin}
              disabled={isLoading}
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
                "Login"
              )}
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
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Forgot Password?{" "}
              <a
                href="/auth/forgot-password"
                style={{ color: darkGreenTheme.palette.primary.main }}
              >
                Click here to reset
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
