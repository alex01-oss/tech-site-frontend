"use client";

import React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import VideoCard from "@/components/layout/VideoCard";

interface VideosSectionProps {
    videos: Video[];
}

const VideosSection: React.FC<VideosSectionProps> = ({ videos }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleVideoClick = (videoId: string) => {
        window.open(`https://googleusercontent.com/youtube.com/watch?v=${videoId}`, '_blank');
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
                            <SwiperSlide key={video.snippet.resourceId.videoId}>
                                <VideoCard video={video} onClick={() => handleVideoClick(video.snippet.resourceId.videoId)} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.snippet.resourceId.videoId}>
                                <VideoCard video={video} onClick={() => handleVideoClick(video.snippet.resourceId.videoId)} />
                            </Grid>
                        ))}
                    </Grid>
                )
            ) : (
                <Grid container justifyContent="center">
                    <Grid item xs={12} key="no-videos">
                        <Typography variant="h6" color="text.secondary" align="center">
                            No videos available yet.
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default VideosSection;