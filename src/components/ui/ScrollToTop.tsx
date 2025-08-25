"use client"

import React from 'react';
import {darken, Fab, useScrollTrigger, useTheme, Zoom} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {SxProps} from '@mui/system';
import {useDictionary} from "@/providers/DictionaryProvider";

export const ScrollToTop = () => {
    const theme = useTheme();
    const dict = useDictionary();

    const fabStyle: SxProps = {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        zIndex: theme.zIndex.fab,
        color: theme.palette.primary.contrastText,
        bgcolor: theme.palette.primary.main,
        '&:hover': {
            bgcolor: darken(theme.palette.primary.main, 0.2),
        },
    };

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <Zoom in={trigger}>
            <Fab
                sx={fabStyle}
                color="inherit"
                size="medium"
                aria-label={dict.catalog.scrollUp}
                onClick={handleClick}
            >
                <KeyboardArrowUpIcon/>
            </Fab>
        </Zoom>
    );
};