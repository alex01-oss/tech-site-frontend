'use client';

import {createTheme, ThemeOptions} from "@mui/material/styles";
import {PaletteMode} from "@mui/material";

const commonPalette = {
    light: {
        primary: {
            main: "#950A3D",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#AD1D1D",
        },
        background: {
            default: "#E6E7E9",
            paper: "#FFFFFF",
            navbar: "#D1D2D4",
        },
        text: {
            primary: "#231F20",
            secondary: "#383E45",
        },
        info: {
            main: "#074A7F",
        },
        success: {
            main: "#074A7F",
        },
        error: {
            main: "#AD1D1D",
        },
    },
    dark: {
        primary: {
            main: "#AD1D1D",
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: "#950A3D",
        },
        background: {
            default: "#121212",
            paper: "#000002",
            navbar: "#000002",
        },
        text: {
            primary: "#E6E7E9",
            secondary: "#D1D2D4",
        },
        info: {
            main: "#074A7F",
        },
        success: {
            main: "#074A7F",
        },
        error: {
            main: "#AD1D1D",
        },
    },
};

export const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === "light" ? commonPalette.light : commonPalette.dark),
        warning: {
            main: "#ED6C02",
        },
    },
    typography: {
        fontFamily: "'Montserrat', sans-serif",
        body1: {fontSize: "16px"},
        button: {textTransform: "none"},
    },
    shape: {
        borderRadius: 2,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    textTransform: "none",
                    "&.Mui-disabled": {
                        backgroundColor: mode === "light" ? "#E6E7E9" : "#121212",
                        color: mode === "light" ? "#D1D2D4" : "#383E45",
                    },
                },
                contained: {
                    color: commonPalette.light.primary.contrastText,
                    backgroundColor: commonPalette[mode].primary.main,
                    "&:hover": {
                        backgroundColor: commonPalette[mode].primary.main,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: commonPalette[mode].background.navbar,
                    boxShadow: "none",
                    backgroundImage: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    backgroundColor: commonPalette[mode].background.paper,
                    color: commonPalette[mode].text.primary,
                },
            },
            variants: [
                {
                    props: {component: 'footer'},
                    style: {
                        backgroundColor: commonPalette[mode].background.navbar,
                        boxShadow: 'none',
                    },
                },
            ],
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    "&.Mui-selected": {
                        backgroundColor: commonPalette[mode].primary.main,
                        color: commonPalette.light.primary.contrastText,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: commonPalette[mode].text.primary,
                    borderRadius: 2,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 2,
                    backgroundColor: commonPalette[mode].background.paper,
                    color: commonPalette[mode].text.primary
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