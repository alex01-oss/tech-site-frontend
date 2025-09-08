"use client";

import {Box, Button, Typography, useTheme} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useDictionary} from "@/providers/DictionaryProvider";

interface Props {
    children: React.ReactNode;
}

const ErrorBoundary = ({ children }: Props) => {
    const [hasError, setHasError] = useState(false);
    const theme = useTheme();
    const dict = useDictionary();

    useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            console.error('Error:', error.error);
            setHasError(true);
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            if (event.reason?.response?.status === 401) return;
            setHasError(true);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    if (hasError) {
        return (
            <Box
                role="alert"
                aria-live="assertive"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    textAlign: 'center',
                    padding: { xs: 2, md: 4 },
                    bgcolor: 'background.default',
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        mb: theme.spacing(2),
                        color: 'primary.main',
                    }}
                >
                    {dict.errorBoundary.title}
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => window.location.reload()}
                    color="primary"
                    aria-label={dict.errorBoundary.reload}
                >
                    {dict.errorBoundary.reload}
                </Button>
            </Box>
        );
    }

    return children;
};

export default ErrorBoundary;