"use client";

import React from 'react';
import Typography from '@mui/material/Typography';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {VideoCard} from "@/components/home/VideoCard";
import {Video} from "@/features/youtube/types";
import {Box, styled} from "@mui/material";
import {VideosSectionDict} from "@/types/dict";

interface Props {
    videos: Video[];
    dict: VideosSectionDict
}

const StyledSwiper = styled(Swiper)(({theme}) => ({
    '& .swiper-pagination-bullet': {
        background: theme.palette.action.disabled,
    },
    '& .swiper-pagination-bullet-active': {
        background: theme.palette.primary.main,
    },
}))

export const VideosSection: React.FC<Props> = ({videos, dict}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleVideoClick = (videoId: string) => {
        window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
    };

    return (
        <Box>
            <Typography variant="h3" component="h2"
                        sx={{mb: {xs: theme.spacing(1), sm: theme.spacing(2)}, color: 'text.primary'}}>
                {dict.title}
            </Typography>

            {videos.length > 0 ? (
                isMobile ? (
                    <StyledSwiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={theme.spacing(2.5)}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        pagination={{clickable: true}}
                        breakpoints={{
                            600: {
                                slidesPerView: 2.1,
                                spaceBetween: theme.spacing(2.5),
                            },
                        }}
                        style={{paddingBottom: theme.spacing(5)}}
                    >
                        {videos.map((video) => (
                            <SwiperSlide key={video.snippet.resourceId.videoId}>
                                <VideoCard video={video} onClickAction={handleVideoClick}/>
                            </SwiperSlide>
                        ))}
                    </StyledSwiper>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gap: theme.spacing(3),
                            gridTemplateColumns: {
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                            },
                            justifyContent: 'center',
                        }}
                    >
                        {videos.map((video) => (
                            <Box key={video.snippet.resourceId.videoId}>
                                <VideoCard video={video} onClickAction={handleVideoClick}/>
                            </Box>
                        ))}
                    </Box>
                )
            ) : (
                <Box>
                    <Typography variant="h6" color="text.secondary" align="center">
                        {dict.empty}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};