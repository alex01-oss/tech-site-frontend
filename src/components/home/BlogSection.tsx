"use client";

import React from 'react';
import {Box, Button, Grid, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Post} from "@/features/blog/types";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {PostCard} from "@/components/blog/PostCard";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {BlogSkeleton} from "@/components/skeletons/BlogSkeleton";

interface Props {
    posts: Post[];
    baseApiUrl: string;
    isLoading: boolean;
    dict: {
        dialog: any,
        blogSection: {
            title: string,
            empty: string,
            viewAll: string,
        }
    }
}

export const BlogSection: React.FC<Props> = ({posts, baseApiUrl, isLoading, dict}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useNavigatingRouter();

    if (isLoading) {
        return (
            <Box>
                <Typography variant="h3" component="h2"
                            sx={{mb: {xs: theme.spacing(2), sm: theme.spacing(3)}, color: 'text.primary'}}>
                    {dict.blogSection.title}
                </Typography>
                <BlogSkeleton/>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h3" component="h2"
                        sx={{mb: {xs: theme.spacing(1), sm: theme.spacing(2)}, color: 'text.primary'}}>
                {dict.blogSection.title}
            </Typography>

            {posts.length > 0 ? (
                isMobile ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={theme.spacing(2)}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        pagination={{clickable: true}}
                        breakpoints={{
                            600: {
                                slidesPerView: 2.1,
                                spaceBetween: theme.spacing(2),
                            },
                        }}
                        style={{paddingBottom: theme.spacing(5)}}
                    >
                        {posts.map((post: Post) => (
                            <SwiperSlide key={post.id}>
                                <PostCard
                                    post={post}
                                    baseApiUrl={baseApiUrl}
                                    height={200}
                                    elevation={0}
                                    showDescription={false}
                                    showAdminControls={false}
                                    dict={dict.dialog}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Grid container spacing={theme.spacing(3)} justifyContent="center">
                        {posts.map((post: Post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <PostCard
                                    post={post}
                                    baseApiUrl={baseApiUrl}
                                    height={200}
                                    elevation={0}
                                    showDescription={false}
                                    showAdminControls={false}
                                    dict={dict.dialog}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )
            ) : (
                <Grid item xs={12}>
                    <Typography variant="h6" color="text.secondary" align="center">
                        {dict.blogSection.empty}
                    </Typography>
                </Grid>
            )}

            {posts.length > 0 && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: {xs: theme.spacing(2), sm: theme.spacing(3)}}}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => router.push("/blog")}
                        sx={{
                            px: theme.spacing(4),
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                    >
                        {dict.blogSection.viewAll}
                    </Button>
                </Box>
            )}
        </Box>
    );
}