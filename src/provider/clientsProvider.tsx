"use client";

import {ReactNode, useEffect, useState} from "react";
import {SnackbarProvider} from "notistack";
import ThemeProviderWrapper from "@/context/context";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {CssBaseline} from "@mui/material";
import {AuthInitializer} from "@/provider/initializer";

export default function ClientProviders({children}: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <GoogleOAuthProvider clientId="173029689005-nnbq1m264cqvke820ik5jn0gio5pbd6d.apps.googleusercontent.com">
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
                <ThemeProviderWrapper key="mui-theme">
                    <CssBaseline/>
                    <AuthInitializer/>
                    {children}
                </ThemeProviderWrapper>
            </SnackbarProvider>
        </GoogleOAuthProvider>
    );
}