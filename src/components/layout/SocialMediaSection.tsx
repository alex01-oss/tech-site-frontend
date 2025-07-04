import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

const SocialMediaSection: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 6, textAlign: 'center' }}>
            <Typography variant="h3" component="h2" sx={{ mb: 4, color: 'text.primary' }}>
                Соціальні Мережі
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <FacebookIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <InstagramIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <YouTubeIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <LinkedInIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <IconButton sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                    <XIcon sx={{ fontSize: 40 }} />
                </IconButton>
            </Box>
        </Container>
    );
};

export default SocialMediaSection;