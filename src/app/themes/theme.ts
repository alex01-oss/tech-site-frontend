'use client';

import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: "#950A3D" },
          secondary: { main: "#B0B0B0" },
          background: { default: "#E6E7E9", paper: "#FFFFFF" },
          text: { primary: "#333333", secondary: "#383E45" },
        }
      : {
          primary: { main: "#E44B7A" },
          secondary: { main: "#7A7A7A" },
          background: { default: "#121212", paper: "#1E1E1E" },
          text: { primary: "#E0E0E0", secondary: "#A0A0A0" },
        }),
  },
  typography: {
    fontFamily: "'Monsterrat', sans-serif",
    body1: { fontSize: "16px" },
    button: { textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          color: mode === 'light' ? "#000" : "#fff",
          "&:active": {
            transform: "scale(0.95)",
          },
          "&.Mui-disabled": { 
            backgroundColor: mode === 'light' ? "#D3D3D3" : "#4A4A4A", 
            color: mode === 'light' ? "#B0B0B0" : "#7A7A7A"
          },
        },
        contained: {
          color: '#fff'
        }
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&.Mui-selected": {
            backgroundColor: mode === 'light' 
              ? "rgba(142, 32, 65, 0.1)" 
              : "rgba(255, 96, 144, 0.2)",
            color: mode === 'light' ? "#950A3D" : "#E44B7A",
            "&:hover": {
              backgroundColor: mode === 'light' 
                ? "rgba(142, 32, 65, 0.2)" 
                : "rgba(255, 96, 144, 0.3)",
            },
          },
        },
        outlined: {
          borderColor: mode === 'light' ? "#950A3D" : "#E44B7A",
          "&.Mui-selected": {
            backgroundColor: mode === 'light' ? "#950A3D" : "#E44B7A",
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
          borderRadius: 4,
          backgroundColor: mode === "light" ? "#FFFFFF" : "#1E1E1E",
          "& fieldset": {
            borderRadius: 4,
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
          borderRadius: 4,
        },
        circular: {
          backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.13)" : "rgba(255, 255, 255, 0.13)",
        },
        text: {
          backgroundColor: mode === "light" ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 255, 255, 0.16)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4, // Квадратні кути
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: mode === "light" 
              ? "rgba(149, 10, 61, 0.1)" 
              : "rgba(228, 75, 122, 0.2)",
          },
          "&:active": {
            backgroundColor: mode === "light" 
              ? "rgba(149, 10, 61, 0.2)" 
              : "rgba(228, 75, 122, 0.3)",
            transform: "scale(0.95)", // Ефект натискання
          },
        },
      },
    },    
  },
});

const createAppTheme = (mode: PaletteMode) => createTheme(getThemeOptions(mode));

export default createAppTheme;