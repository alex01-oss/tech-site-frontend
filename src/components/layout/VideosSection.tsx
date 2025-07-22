"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface YouTubeVideoProps {
    id: { videoId: string };
    snippet: {
        title: string;
        thumbnails: {
            high: { url: string };
            medium: { url: string };
        };
    };
}

interface VideosSectionProps {
    videos: YouTubeVideoProps[];
}

const VideosSection: React.FC<VideosSectionProps> = ({ videos }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleVideoClick = (videoId: string) => {
        window.open(`http://googleusercontent.com/youtube.com/watch?v=${videoId}`, '_blank');
    };

    return (
        <Container maxWidth="lg" sx={{ my: 6 }}>
            <Typography variant="h3" component="h2" sx={{ mb: 4, color: 'text.primary' }}>
                Our videos
            </Typography>

            {videos.length > 0 ? (
                isMobile ? (
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={20}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        pagination={{ clickable: true }}
                        navigation={true}
                        breakpoints={{
                            600: {
                                slidesPerView: 2.1,
                                spaceBetween: 30,
                            },
                        }}
                        style={{ paddingBottom: '40px' }}
                    >
                        {videos.map((video) => (
                            <SwiperSlide key={video.id.videoId}>
                                <Paper
                                    sx={{
                                        position: 'relative',
                                        height: 200,
                                        backgroundImage: `url(${video.snippet.thumbnails.high.url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                    }}
                                    onClick={() => handleVideoClick(video.id.videoId)}
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
                                        {video.snippet.title}
                                    </Typography>
                                </Paper>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
                                <Paper
                                    sx={{
                                        position: 'relative',
                                        height: 200,
                                        backgroundImage: `url(${video.snippet.thumbnails.high.url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                    }}
                                    onClick={() => handleVideoClick(video.id.videoId)}
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
                                        {video.snippet.title}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )
            ) : (
                <Grid item xs={12} key="no-videos">
                    <Typography variant="h6" color="text.secondary" align="center">
                        No videos available yet.
                    </Typography>
                </Grid>
            )}
        </Container>
    );
};

export default VideosSection;