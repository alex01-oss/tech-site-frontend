'use client';

import { createTheme, ThemeOptions } from "@mui/material/styles";
import { PaletteMode } from "@mui/material";

const commonPalette = {
  light: {
    primary: { main: "#950A3D" },
    secondary: { main: "#AD1D1D" },
    background: { default: "#E6E7E9", paper: "#FFFFFF" },
    text: { primary: "#121212", secondary: "#1E1E1E" },
  },
  dark: {
    primary: { main: "#AD1D1D" },
    secondary: { main: "#950A3D" },
    background: { default: "#121212", paper: "#1E1E1E" },
    text: { primary: "#E6E7E9", secondary: "#FFFFFF" },
  },
};


export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light" ? commonPalette.light : commonPalette.dark),
    success: { 
      main: mode === "light" ? "#074A7F" : "#2C91D7", 
    },
    error: { 
      main: mode === "light" ? "#950A3D" : "#AD1D1D",
    },
    info: { 
      main: mode === "light" ? "#074A7F" : "#2C91D7", 
    },
    warning: { 
      main: mode === "light" ? "#FFB74D" : "#ED6C02", 
    },
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
    body1: { fontSize: "16px" },
    button: { textTransform: "none" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          color: mode === "light" ? "#121212" : "#E6E7E9",
          "&.Mui-disabled": {
            backgroundColor: mode === "light" ? "#E6E7E9" : "#1E1E1E",
            color: mode === "light" ? "#950A3D" : "#AD1D1D",
          },
        },
        contained: {
          color: "#FFF"
        }
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === "light" ? "#383E45" : "#1E1E1E",
          boxShadow: "none",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: mode === "light" ? "#FFFFFF" : "#1E1E1E",
          color: mode === "light" ? "#121212" : "#E6E7E9",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          "&.Mui-selected": {
            backgroundColor: mode === "light" ? "#950A3D" : "#AD1D1D",
            color: "#FFFFFF",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#E6E7E9",
          borderRadius: 4,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: mode === "light" ? "#FFFFFF" : "#1E1E1E",
        },
      },
    }, 
    MuiLink: {
      styleOverrides: {
        root: {
          color: "inherit",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

const createAppTheme = (mode: PaletteMode) => createTheme(getThemeOptions(mode));

export default createAppTheme;