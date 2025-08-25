'use client';

import {Box, Card, Stack, Typography, useTheme} from '@mui/material';
import React from 'react';
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {useDictionary} from "@/providers/DictionaryProvider";

interface AuthCardLayoutProps {
    title: string;
    children: React.ReactNode;
    isLogin?: boolean;
}

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
    title,
    children,
    isLogin = false,
}) => {
    const theme = useTheme();
    const router = useNavigatingRouter();
    const dict = useDictionary();

    return (
        <Stack
            height="80vh"
            p={theme.spacing(2)}
            justifyContent="center"
            role="form"
            aria-label={isLogin ? dict.auth.login.title : dict.auth.register.title}
        >
            <Card
                variant="outlined"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                    width: '100%',
                    maxWidth: 450,
                    p: { xs: theme.spacing(2), sm: theme.spacing(3) },
                    gap: { xs: theme.spacing(2), sm: theme.spacing(3) },
                    m: "auto",
                    boxShadow: theme.shadows[3],
                    borderRadius: theme.shape.borderRadius,
                }}
            >
                <Typography variant="h4" component="h1" textAlign="center" fontWeight={600} sx={{ mt: theme.spacing(2) }}>
                    {title}
                </Typography>
                {children}
                <Typography textAlign="center">
                    {isLogin ? (
                        <>
                            {dict.auth.login.noAccount}{" "}
                            <Box
                                component="span"
                                onClick={() => router.push("/registration")}
                                role="link"
                                tabIndex={0}
                                sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                            >
                                {dict.auth.register.button}
                            </Box>
                        </>
                    ) : (
                        <>
                            {dict.auth.login.haveAccount}{" "}
                            <Box
                                component="span"
                                onClick={() => router.push("/login")}
                                role="link"
                                tabIndex={0}
                                sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                            >
                                {dict.auth.login.button}
                            </Box>
                        </>
                    )}
                </Typography>
            </Card>
        </Stack>
    );
};