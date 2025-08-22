'use client';

import {Box, Card, Stack, Typography, useTheme} from '@mui/material';
import React from 'react';
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {AuthLayoutDict} from "@/types/dict";

interface AuthCardLayoutProps {
    title: string;
    children: React.ReactNode;
    isLogin?: boolean;
    dict: AuthLayoutDict
}

export const AuthCardLayout: React.FC<AuthCardLayoutProps> = ({
    title,
    children,
    isLogin = false,
    dict
}) => {
    const theme = useTheme();
    const router = useNavigatingRouter();

    return (
        <Stack height="80vh" p={theme.spacing(2)} justifyContent="center" role="form" aria-label={dict.authFormLabel}>
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
                            {dict.noAccount}{" "}
                            <Box
                                component="span"
                                onClick={() => router.push("/registration")}
                                role="link"
                                tabIndex={0}
                                sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                            >
                                {dict.signUp}
                            </Box>
                        </>
                    ) : (
                        <>
                            {dict.haveAccount}{" "}
                            <Box
                                component="span"
                                onClick={() => router.push("/login")}
                                role="link"
                                tabIndex={0}
                                sx={{ cursor: 'pointer', color: theme.palette.primary.main }}
                            >
                                {dict.signIn}
                            </Box>
                        </>
                    )}
                </Typography>
            </Card>
        </Stack>
    );
};