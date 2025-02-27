'use client';

import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: "#8E2041" },
          secondary: { main: "#B0B0B0" },
          background: { default: "#F0F0F0", paper: "#FFFFFF" },
          text: { primary: "#333333", secondary: "#666666" },
        }
      : {
          primary: { main: "#FF6090" },
          secondary: { main: "#7A7A7A" },
          background: { default: "#121212", paper: "#1E1E1E" },
          text: { primary: "#E0E0E0", secondary: "#A0A0A0" },
        }),
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    body1: { fontSize: "16px" },
    button: { textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          color: "#FFFFFF",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
          "&.Mui-disabled": { 
            backgroundColor: mode === 'light' ? "#D3D3D3" : "#4A4A4A", 
            color: mode === 'light' ? "#B0B0B0" : "#7A7A7A"
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          transition: "background-color 0.3s ease, transform 0.2s ease",
          "&.Mui-selected": {
            backgroundColor: mode === 'light' 
              ? "rgba(142, 32, 65, 0.1)" 
              : "rgba(255, 96, 144, 0.2)",
            color: mode === 'light' ? "#8E2041" : "#FF6090",
            "&:hover": {
              backgroundColor: mode === 'light' 
                ? "rgba(142, 32, 65, 0.2)" 
                : "rgba(255, 96, 144, 0.3)",
            },
          },
        },
        outlined: {
          borderColor: mode === 'light' ? "#8E2041" : "#FF6090",
          "&.Mui-selected": {
            backgroundColor: mode === 'light' ? "#8E2041" : "#FF6090",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: mode === 'light' 
                ? "rgba(142, 32, 65, 0.8)" 
                : "rgba(255, 96, 144, 0.8)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? "#FFFFFF" : "#1E1E1E",
          color: mode === 'light' ? "#333333" : "#E0E0E0",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? "#FFFFFF" : "#1E1E1E",
          borderBottomColor: mode === 'light' 
            ? "rgba(78, 12, 30, 0.2)" 
            : "rgba(255, 96, 144, 0.2)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: mode === "light" ? "#FFFFFF" : "#1E1E1E",
          "& fieldset": {
            borderRadius: "8px",
            borderColor: "rgba(78, 12, 30, 0.2)",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.11)" : "rgba(255, 255, 255, 0.11)",
        },
        rectangular: {
          borderRadius: "8px",
        },
        circular: {
          backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.13)" : "rgba(255, 255, 255, 0.13)",
        },
        text: {
          backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 255, 255, 0.16)",
        },
      },
    },
  },
});

const createAppTheme = (mode: PaletteMode) => createTheme(getThemeOptions(mode));

export default createAppTheme;