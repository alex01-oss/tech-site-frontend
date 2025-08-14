"use client";

import React from 'react';
import {Box, Button, Container, Grid, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Post} from "@/features/blog/types";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import PostCard from "@/components/blog/PostCard";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import BlogSkeleton from "@/components/skeletons/BlogSkeleton";

interface BlogSectionProps {
    posts: Post[];
    baseApiUrl: string;
    isLoading: boolean;
}

export default function BlogSection({posts, baseApiUrl, isLoading}: BlogSectionProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useNavigatingRouter();

    if (isLoading) {
        return (
            <Box>
                <Typography variant="h3" component="h2" sx={{mb: {xs: 2, sm: 3}, color: 'text.primary'}}>
                    Our blog
                </Typography>
                <BlogSkeleton/>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h3" component="h2" sx={{mb: {xs: 1, sm: 2}, color: 'text.primary'}}>
                Our blog
            </Typography>

            {posts.length > 0 ? (
                isMobile ? (
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={20}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        pagination={{clickable: true}}
                        breakpoints={{
                            600: {
                                slidesPerView: 2.1,
                                spaceBetween: 20,
                            },
                        }}
                        style={{paddingBottom: '40px'}}
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
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <Grid container spacing={3} justifyContent="center">
                        {posts.map((post: Post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <PostCard
                                    post={post}
                                    baseApiUrl={baseApiUrl}
                                    height={200}
                                    elevation={0}
                                    showDescription={false}
                                    showAdminControls={false}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )
            ) : (
                <Grid item xs={12}>
                    <Typography variant="h6" color="text.secondary" align="center">
                        No blog posts available yet.
                    </Typography>
                </Grid>
            )}

            {posts.length > 0 && (
                <Box sx={{display: 'flex', justifyContent: 'center', mt: {xs: 2, sm: 3}}}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => router.push("/blog")}
                        sx={{
                            px: 4,
                            borderRadius: 1,
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                    >
                        View All Posts
                    </Button>
                </Box>
            )}
        </Box>
    );
}