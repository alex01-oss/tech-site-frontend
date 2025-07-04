import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {IconButton} from "@mui/material";

const HeroSection: React.FC = () => {
    return (
        <Box
            sx={{
                position: 'relative',
                height: { xs: '300px', md: '500px' },
                width: '100%',
                backgroundImage: 'url("/hero_bg.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                color: 'white',
                p: { xs: 2, md: 4 },
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
            }} />

            <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { md: '60%' } }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing.
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                    Lorem ipsum dolor sit amet.
                </Typography>
                <Button variant="contained" color="primary" size="large">
                    More Info
                </Button>
            </Box>

            <IconButton
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: 16,
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>
            <IconButton
                sx={{
                    position: 'absolute',
                    top: '50%',
                    right: 16,
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};

export default HeroSection;