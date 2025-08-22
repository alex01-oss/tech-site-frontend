'use client';

import {Box, Container, useTheme} from '@mui/material';
import {useLayout} from '@/hooks/useLayout';
import React from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import {Footer} from "@/components/layout/Footer";
import {Navbar} from "@/components/layout/Navbar";
import {LayoutDict} from "@/types/dict";

interface LayoutContentProps {
    children: React.ReactNode;
    dict: LayoutDict
}

export default function LayoutContent({ children, dict }: LayoutContentProps) {
    const { hasTopMargin } = useLayout();
    const theme = useTheme();

    return (
        <ErrorBoundary dict={dict.errorBoundary}>
            <Container
                sx={{
                    maxWidth: 'lg',
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    component="a"
                    href="#main-content"
                    sx={{
                        position: 'absolute',
                        left: '-9999px',
                        top: 'auto',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                        zIndex: 9999,
                        '&:focus': {
                            position: 'static',
                            width: 'auto',
                            height: 'auto',
                            left: 'auto',
                            p: 1,
                            border: `1px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                        },
                    }}
                >
                    {dict.layout.skipToMainContent}
                </Box>

                <Box
                    component="nav"
                    sx={{
                        mb: hasTopMargin
                            ? { xs: theme.spacing(10), sm: theme.spacing(11) }
                            : 0,
                    }}
                >
                    <Navbar dict={{
                        navbar: dict.layout.navbar,
                        avatar: dict.layout.avatar
                    }} />
                </Box>

                <Box
                    component="main"
                    id="main-content"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {children}
                </Box>
            </Container>

            <Box
                sx={{
                    mt: { xs: theme.spacing(2), sm: theme.spacing(3) },
                }}
            >
                <Footer dict={dict.layout.footer} />
            </Box>
        </ErrorBoundary>
    );
}