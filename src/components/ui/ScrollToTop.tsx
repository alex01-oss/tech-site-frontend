"use client"

import React from 'react';
import {darken, Fab, useScrollTrigger, useTheme, Zoom} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {SxProps} from '@mui/system';

const ScrollToTop = () => {
    const theme = useTheme();

    const fabStyle: SxProps = {
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        color: 'catalog.white',
        bgcolor: 'primary.main',
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
                aria-label="scroll back to top"
                onClick={handleClick}
            >
                <KeyboardArrowUpIcon/>
            </Fab>
        </Zoom>
    );
};

export default ScrollToTop;