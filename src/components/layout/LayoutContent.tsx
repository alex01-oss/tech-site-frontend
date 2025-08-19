'use client';

import {Box, Container} from '@mui/material';
import {useLayout} from '@/contexts/LayoutContext';
import React from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import {Footer} from "@/components/layout/Footer";
import {Navbar} from "@/components/layout/Navbar";

interface LayoutContentProps {
    children: React.ReactNode;
    dict: {
        layout: {
            navbar: any,
            footer: any,
        }
        errorBoundary: any
    }
}

export default function LayoutContent({ children, dict }: LayoutContentProps) {
    const { hasTopMargin } = useLayout();

    return (
        <ErrorBoundary dict={dict.errorBoundary}>
            <Container sx={{
                maxWidth: 'lg',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{mb: hasTopMargin ? {xs: 10, sm: 11} : 0}}>
                    <Navbar dict={dict.layout.navbar}/>
                </Box>

                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    {children}
                </Box>
            </Container>

            <Box sx={{mt: {xs: 2, sm: 3}}}>
                <Footer dict={dict.layout.footer}/>
            </Box>
        </ErrorBoundary>
    );
}