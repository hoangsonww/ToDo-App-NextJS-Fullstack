import { createTheme } from "@mui/material/styles";

export const getAppTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#0f8f5f",
      },
      secondary: {
        main: "#0d533b",
      },
      background: {
        default: isDarkMode ? "#050b08" : "#f3f5f2",
        paper: isDarkMode ? "#0f1f1a" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#eaf7f0" : "#0d2621",
        secondary: isDarkMode ? "#c6dcd1" : "#35524a",
      },
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
          },
          colorDefault: isDarkMode
            ? {
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#eaf7f0",
                borderColor: "rgba(255,255,255,0.18)",
              }
            : {},
        },
      },
    },
  });
