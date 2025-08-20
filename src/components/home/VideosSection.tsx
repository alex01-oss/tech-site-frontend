"use client";

import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {VideoCard} from "@/components/home/VideoCard";
import {Video} from "@/features/youtube/types";
import {Box} from "@mui/material";

interface Props {
    videos: Video[];
    dict: {
        title: string,
        empty: string,
    }
}

export const VideosSection: React.FC<Props> = ({ videos, dict }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleVideoClick = (videoId: string) => {
        window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
    };

    return (
        <Box>
            <Typography variant="h3" component="h2" sx={{ mb: { xs: theme.spacing(1), sm: theme.spacing(2) }, color: 'text.primary' }}>
                {dict.title}
            </Typography>

            {videos.length > 0 ? (
                isMobile ? (
                    <>
                        <Swiper
                            modules={[Pagination, Navigation]}
                            spaceBetween={theme.spacing(2.5)} // 20px
                            slidesPerView={1.1}
                            centeredSlides={true}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                600: {
                                    slidesPerView: 2.1,
                                    spaceBetween: theme.spacing(2.5),
                                },
                            }}
                            style={{ paddingBottom: theme.spacing(5) }} // 40px
                        >
                            {videos.map((video) => (
                                <SwiperSlide key={video.snippet.resourceId.videoId}>
                                    <VideoCard video={video} onClickAction={handleVideoClick} />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <style jsx global>{`
                            .swiper-pagination-bullet {
                                background: ${theme.palette.action.disabled};
                            }
                            .swiper-pagination-bullet-active {
                                background: ${theme.palette.primary.main};
                            }
                        `}</style>
                    </>
                ) : (
                    <Grid container spacing={theme.spacing(3)} justifyContent="center">
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video.snippet.resourceId.videoId}>
                                <VideoCard video={video} onClickAction={handleVideoClick} />
                            </Grid>
                        ))}
                    </Grid>
                )
            ) : (
                <Grid container justifyContent="center">
                    <Grid item xs={12} key="no-videos">
                        <Typography variant="h6" color="text.secondary" align="center">
                            {dict.empty}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};