'use client';

import { createTheme, ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    primary: { main: "#8E2041" },
    secondary: { main: "#B0B0B0" },
    background: { default: "#F0F0F0" },
    text: { primary: "#333333", secondary: "#666666" },
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
          backgroundColor: "#8E2041",
          color: "#FFFFFF",
          "&.Mui-disabled": { backgroundColor: "#D3D3D3", color: "#B0B0B0" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: "#333333",
          borderBottom: "1px solid #E0E0E0",
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          color: "#8E2041",
          "&.Mui-selected": {
            backgroundColor: "rgba(142, 32, 65, 0.1)",
            color: "#8E2041",
            "&:hover": {
              backgroundColor: "rgba(142, 32, 65, 0.1)",
            },
          },
        },
        outlined: {
          borderColor: "#8E2041",
          "&.Mui-selected": {
            backgroundColor: "#8E2041",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "rgba(142, 32, 65, 0.1)",
              color: "#8E2041",
            },
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);

export default theme;
