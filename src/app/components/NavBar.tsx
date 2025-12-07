"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AppRegistration,
  Person,
} from "@mui/icons-material";

interface NavBarProps {
  user: { id: number; username: string } | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

const links = [
  { label: "Home", href: "/home" },
  { label: "Planner", href: "/planner" },
  { label: "Insights", href: "/insights" },
  { label: "Focus", href: "/focus" },
  { label: "Profile", href: "/profile" },
];

export default function NavBar({
  user,
  isDarkMode,
  toggleDarkMode,
  onLogout,
}: NavBarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const isActive = (href: string) => pathname === href;
  const toggleDrawer = () => setMobileOpen((prev) => !prev);
  const openMenu = (event: React.MouseEvent<HTMLElement>) =>
    setMenuAnchor(event.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const renderLinks = (closeAfterClick?: boolean) =>
    links.map((link) => (
      <ListItem key={link.href} disablePadding>
        <ListItemButton
          component={Link}
          href={link.href}
          onClick={closeAfterClick ? toggleDrawer : undefined}
          sx={{
            borderRadius: 2,
            mx: 0.5,
            backgroundColor: isActive(link.href)
              ? "rgba(255,255,255,0.12)"
              : "transparent",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.16)",
            },
          }}
        >
          <ListItemText
            primary={link.label}
            primaryTypographyProps={{
              fontWeight: isActive(link.href) ? 700 : 500,
              color: isDarkMode ? "#f5f5f5" : "#0a1f1a",
            }}
          />
        </ListItemButton>
      </ListItem>
    ));

  const drawer = (
    <Box
      sx={{
        width: 280,
        bgcolor: isDarkMode ? "#0f1f1a" : "#f7f7f7",
        color: isDarkMode ? "#f7f7f7" : "#0f1f1a",
        height: "100%",
        p: 2,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={700}>
          Menu
        </Typography>
        <IconButton onClick={toggleDrawer} size="small">
          <CloseIcon sx={{ color: isDarkMode ? "#fff" : "#0f1f1a" }} />
        </IconButton>
      </Box>
      <Divider
        sx={{ my: 2, borderColor: isDarkMode ? "#1f3d33" : "#e0e0e0" }}
      />
      <List>{renderLinks(true)}</List>
      <Divider
        sx={{ my: 2, borderColor: isDarkMode ? "#1f3d33" : "#e0e0e0" }}
      />
      <Button
        fullWidth
        component={Link}
        href="/profile"
        onClick={toggleDrawer}
        variant="contained"
        startIcon={<AccountCircle />}
        sx={{ mb: 1, color: "#ffffff" }}
      >
        Profile
      </Button>
      {user ? (
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          onClick={() => {
            onLogout();
            toggleDrawer();
          }}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      ) : (
        <>
          <Button
            fullWidth
            component={Link}
            href="/auth/login"
            onClick={toggleDrawer}
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ mb: 1, color: "#ffffff" }}
          >
            Login
          </Button>
          <Button
            fullWidth
            component={Link}
            href="/auth/register"
            onClick={toggleDrawer}
            variant="outlined"
            startIcon={<AppRegistration />}
          >
            Register
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: isDarkMode
          ? "linear-gradient(90deg, #0f1f1a, #0c3d2d)"
          : "linear-gradient(90deg, #0f8f5f, #0a6c45)",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 0,
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <IconButton
            edge="start"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              mr: 1,
              color: "#fff",
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              textDecoration: "none",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "0.03em",
            }}
          >
            Flowlist
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {links.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                color: "#fff",
                fontWeight: isActive(link.href) ? 700 : 500,
                textTransform: "none",
                backgroundColor: isActive(link.href)
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.16)",
                },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {user ? (
            <>
              <Button
                onClick={openMenu}
                sx={{
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 1.5,
                }}
                startIcon={
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      fontSize: 14,
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                }
              >
                {user.username}
              </Button>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <MenuItem component={Link} href="/profile" onClick={closeMenu}>
                  <ListItemIcon>
                    <Person fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/auth/register"
                  onClick={closeMenu}
                >
                  <ListItemIcon>
                    <AppRegistration fontSize="small" />
                  </ListItemIcon>
                  Register
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    closeMenu();
                    onLogout();
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button
                onClick={openMenu}
                sx={{ color: "#fff", textTransform: "none", fontWeight: 600 }}
              >
                Account
              </Button>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <MenuItem
                  component={Link}
                  href="/auth/login"
                  onClick={closeMenu}
                >
                  <ListItemIcon>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  href="/auth/register"
                  onClick={closeMenu}
                >
                  <ListItemIcon>
                    <AppRegistration fontSize="small" />
                  </ListItemIcon>
                  Register
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
