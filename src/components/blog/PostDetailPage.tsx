"use client";

import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress, Paper, Typography} from '@mui/material';
import Image from 'next/image';
import {Post} from '@/features/blog/types';
import {blogApi} from "@/features/blog/api";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";

interface PostDetailPageProps {
    initialPost?: Post;
    postId: number;
    baseApiUrl: string;
    dict: {
        loading: string;
        goBack: string;
        published: string;
    }
}

export function PostDetailPage({initialPost, postId, baseApiUrl, dict}: PostDetailPageProps) {
    const [post, setPost] = useState<Post | null>(initialPost || null);
    const [isLoading, setIsLoading] = useState<boolean>(!initialPost);
    const [error, setError] = useState<string | null>(null);
    const router = useNavigatingRouter();

    useEffect(() => {
        if (!post && postId) {
            setIsLoading(true);
            blogApi.fetchPost(postId)
                .then(fetchedPost => {
                    if (!fetchedPost) return
                    setPost(fetchedPost);
                })
                .catch(err => {
                    console.error("Failed to fetch post data:", err);
                    setError(err.message || 'Failed to load post data.');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [postId, post, router]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
                <Typography variant="h6" sx={{ml: 2}}>{dict.loading}</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={() => router.back()} sx={{mt: 2}}>{dict.goBack}</Button>
            </Box>
        );
    }

    if (!post) {
        return null;
    }

    const createMarkup = (htmlString: string) => {
        return {__html: htmlString};
    };

    return (
        <Paper elevation={3} sx={{p: {xs: 2, sm: 3}, borderRadius: 1}}>
            {post.image && (
                <Box sx={{
                    mb: 4,
                    width: '100%',
                    aspectRatio: '16/9',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 1
                }}>
                    <Image
                        src={`${baseApiUrl}/${post.image}`}
                        alt={post.title}
                        fill
                        style={{objectFit: 'cover'}}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 80vw, 700px"
                        priority
                    />
                </Box>
            )}

            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    mb: 3,
                    color: 'text.primary',
                    fontSize: {
                        xs: '1.5rem',
                        sm: '2rem',
                        md: '3rem',
                    },
                }}
            >
                {post.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                {dict.published} {new Date(post.created_at).toLocaleDateString()}
            </Typography>

            <Box
                sx={{
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    color: 'text.secondary',
                    '& p': {mb: 1.5},
                    '& ul, & ol': {ml: 2, mb: 1.5},
                    '& img': {maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2},
                    '& b': {fontWeight: 'bold'},
                    '& i': {fontStyle: 'italic'},
                    '& u': {textDecoration: 'underline'},
                }}
                dangerouslySetInnerHTML={createMarkup(post.content)}
            />

        </Paper>
    );
}