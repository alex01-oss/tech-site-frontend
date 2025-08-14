"use client";

import React, {
    createContext,
    useState,
    useMemo,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import {ThemeProvider as MuiThemeProvider} from "@mui/material/styles";
import {PaletteMode} from "@mui/material";
import createAppTheme from "@/themes/theme";

type ThemeContextType = {
    mode: PaletteMode;
    toggleColorMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    mode: "light",
    toggleColorMode: () => {
    },
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProviderWrapper = ({children}: ThemeProviderProps) => {
    const [mode, setMode] = useState<PaletteMode>("light");

    useEffect(() => {
        const savedMode = localStorage.getItem("themeMode");
        if (savedMode && (savedMode === "light" || savedMode === "dark")) {
            setMode(savedMode as PaletteMode);
        } else {
            const prefersDarkMode =
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            setMode(prefersDarkMode ? "dark" : "light");
        }
    }, []);

    const toggleColorMode = () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode(newMode);
        localStorage.setItem("themeMode", newMode);
    };

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const contextValue = useMemo(
        () => ({
            mode,
            toggleColorMode,
        }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProviderWrapper;
