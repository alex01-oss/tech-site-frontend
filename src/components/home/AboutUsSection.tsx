"use client"

import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import {useTheme} from "@mui/material";
import {AboutUsDict} from "@/types/dict";

export const AboutUsSection: React.FC<{ dict: AboutUsDict }> = ({ dict }) => {
    const theme = useTheme();

    return (
        <Paper sx={{
            p: theme.spacing(3),
            bgcolor: 'background.paper',
            borderRadius: theme.shape.borderRadius
        }}>
            <Typography variant="h4" component="h2" sx={{
                mb: {xs: theme.spacing(1), sm: theme.spacing(2)},
                color: 'primary.main',
                textAlign: 'center'
            }}>
                {dict.title}
            </Typography>
            <Typography variant="body1" sx={{
                color: 'text.secondary',
                textAlign: 'justify',
                lineHeight: 1.8
            }}>
                {dict.content}
            </Typography>
        </Paper>
    );
};