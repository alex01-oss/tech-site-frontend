"use client";

import React from 'react';
import {Box, Button, Typography} from '@mui/material';
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
import {useDictionary} from "@/providers/DictionaryProvider";

interface Props {
    posts: Post[];
    baseApiUrl: string;
    isLoading: boolean;
}

export const BlogSection: React.FC<Props> = ({posts, isLoading}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useNavigatingRouter();
    const dict = useDictionary();

    return (
        <Box>
            <Typography variant="h3" component="h2"
                        sx={{mb: {xs: theme.spacing(1), sm: theme.spacing(2)}, color: 'text.primary'}}>
                {dict.blog.title}
            </Typography>

            {isLoading
                ? <BlogSkeleton />
                : posts.length > 0 ? (
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
                                        height={200}
                                        elevation={0}
                                        showDescription={false}
                                        showAdminControls={false}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <Box
                            component="ul"
                            sx={{
                                display: 'grid',
                                gap: theme.spacing(3),
                                gridTemplateColumns: {
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                },
                                justifyContent: 'center',
                                listStyle: 'none',
                                padding: 0,
                            }}
                        >
                            {posts.map((post: Post) => (
                                <Box key={post.id} component="li">
                                    <PostCard
                                        post={post}
                                        height={200}
                                        elevation={0}
                                        showDescription={false}
                                        showAdminControls={false}
                                    />
                                </Box>
                            ))}
                        </Box>
                    )
                ) : (
                    <Typography variant="h6" color="text.secondary" align="center" role="status" aria-live="polite">
                        {dict.blog.empty}
                    </Typography>
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
                        aria-label={dict.blog.viewAll}
                    >
                        {dict.blog.viewAll}
                    </Button>
                </Box>
            )}
        </Box>
    );
}