"use client";
import React, { useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
} from "@mui/material";
import "../page.css";
import {
  Brightness4,
  Brightness7,
  Close as CloseIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    router.push("/auth/login");
  };

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );
    if (storedUser) {
      setUser(storedUser);
    }
  }, [router]);

  useEffect(() => {
    const prefersDarkMode = JSON.parse(
      localStorage.getItem("darkMode") || "true",
    );
    setIsDarkMode(prefersDarkMode);

    // Add the animation class after component mounts
    const timer = setTimeout(() => {
      setAnimationClass("animated");
    }, 100); // Small delay for the effect

    return () => clearTimeout(timer);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

        {/* Hero Section */}
        <Box
          className={animationClass}
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "50px 20px",
            backgroundColor: isDarkMode ? "#222" : "#f9f9f9",
            color: isDarkMode ? "#fff" : "#000",
            transition: "all 0.3s ease",
          }}
        >
          <Container>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              Welcome to the NextJS To-Do App
            </Typography>
            <Typography variant="h6" gutterBottom>
              Organize your tasks, increase your productivity, and manage your
              to-dos effortlessly with our simple and intuitive app.
            </Typography>
            <Link href="/auth/register" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: darkGreenTheme.palette.primary.main,
                  color: "#fff",
                  mt: 3,
                  "&:hover": { backgroundColor: "#004d00" },
                }}
              >
                Get Started
              </Button>
            </Link>
          </Container>
        </Box>

        {/* Features Section */}
        <Container className={animationClass} sx={{ py: 8 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#000",
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Easy to Use
                </Typography>
                <Typography variant="body2">
                  Our app is designed with simplicity in mind. Easily manage
                  your tasks with a clean and intuitive interface.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#000",
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Stay Organized
                </Typography>
                <Typography variant="body2">
                  Keep track of your tasks, categorize them, and stay organized.
                  Never miss an important task again.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={4}
                sx={{
                  padding: 3,
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  color: isDarkMode ? "#fff" : "#000",
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "all 0.3s ease",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Dark Mode Support
                </Typography>
                <Typography variant="body2">
                  Enjoy using the app in both light and dark modes. Switch
                  between modes for a more comfortable experience.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Call-to-Action Section */}
        <Box
          className={animationClass}
          sx={{
            textAlign: "center",
            py: 4,
            backgroundColor: isDarkMode ? "#444" : "#e8e8e8",
            color: isDarkMode ? "#fff" : "#000",
            transition: "all 0.3s ease",
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
                color: "#fff",
                mt: 2,
                transition: "all 0.3s ease",
                "&:hover": { backgroundColor: "#004d00" },
              }}
            >
              Start Your Journey
            </Button>
          </Link>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            textAlign: "center",
            py: 2,
            backgroundColor: darkGreenTheme.palette.primary.main,
            color: "#ffffff",
            transition: "all 0.3s ease",
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
