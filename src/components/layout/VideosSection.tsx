import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';

const videos = [
    { id: 1, title: 'Профільне шліфування', thumbnail: '/images/video_thumb_1.jpg' },
    { id: 2, title: 'Технологія виробництва', thumbnail: '/images/video_thumb_2.jpg' },
    { id: 3, title: 'Нові інструменти 2025', thumbnail: '/images/video_thumb_3.jpg' },
];

const VideosSection: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ my: 6 }}>
            <Typography variant="h3" component="h2" sx={{ mb: 4, color: 'text.primary' }}>
                Our videos
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {videos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <Paper
                            sx={{
                                position: 'relative',
                                height: 200,
                                backgroundImage: `url(${video.thumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    bgcolor: 'rgba(0,0,0,0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                                    <PlayArrowIcon sx={{ fontSize: 60 }} />
                                </IconButton>
                            </Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    zIndex: 2,
                                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                                }}
                            >
                                {video.title}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default VideosSection;