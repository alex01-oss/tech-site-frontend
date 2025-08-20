'use client';

import {Card, Link, Stack, Typography, useTheme} from '@mui/material';
import React from 'react';
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";

interface AuthCardLayoutProps {
    title: string;
    children: React.ReactNode;
    isLogin?: boolean;
    dict: {
        haveAccount: string;
        noAccount: string;
        signUp: string;
        signIn: string;
    }
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
        <Stack height="80vh" p={2} justifyContent="center">
            <Card
                variant="outlined"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignSelf: "center",
                    width: '100%',
                    maxWidth: 450,
                    p: { xs: 2, sm: 3 },
                    gap: { xs: 2, sm: 3 },
                    m: "auto",
                    boxShadow: theme.shadows[3],
                    borderRadius: 1
                }}
            >
                <Typography variant="h4" textAlign="center" fontWeight={600} sx={{ mt: 2 }}>
                    {title}
                </Typography>
                {children}
                <Typography textAlign="center">
                    {isLogin ? (
                        <>
                            {dict.noAccount}{" "}
                            <Link component="button" onClick={() => router.push("/registration")}
                                  sx={{ cursor: 'pointer' }}>
                                {dict.signUp}
                            </Link>
                        </>
                    ) : (
                        <>
                            {dict.haveAccount}{" "}
                            <Link component="button" onClick={() => router.push("/login")} sx={{ cursor: 'pointer' }}>
                                {dict.signIn}
                            </Link>
                        </>
                    )}
                </Typography>
            </Card>
        </Stack>
    );
};