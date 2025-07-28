"use client";

import React, {ReactNode, useEffect, useState} from "react";
import {SnackbarProvider} from "notistack";
import ThemeProviderWrapper from "@/context/context";
import {Box, CssBaseline, LinearProgress} from "@mui/material";
import {AuthInitializer} from "@/provider/initializer";
import {useNavigationStore} from "@/app/store/navigationStore";

export default function ClientProviders({children}: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const { isNavigating } = useNavigationStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
            <ThemeProviderWrapper key="mui-theme">
                <CssBaseline/>
                <AuthInitializer/>
                {isNavigating && (
                    <Box sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 2000,
                    }}>
                        <LinearProgress color="primary" />
                    </Box>
                )}
                {children}
            </ThemeProviderWrapper>
        </SnackbarProvider>
    );
}