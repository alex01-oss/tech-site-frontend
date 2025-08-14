'use client';
import {Box, Container} from '@mui/material';
import { useLayout } from '@/contexts/LayoutContext';
import React from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LayoutContentProps {
    children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
    const { hasTopMargin } = useLayout();

    return (
        <ErrorBoundary>
            <Container sx={{
                maxWidth: 'lg',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box sx={{mb: hasTopMargin ? {xs: 10, sm: 11} : 0}}>
                    <Navbar/>
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
                <Footer/>
            </Box>
        </ErrorBoundary>
    );
}