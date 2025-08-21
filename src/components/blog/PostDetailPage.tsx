"use client";

import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Typography, useTheme} from '@mui/material';
import Image from 'next/image';
import {Post} from '@/features/blog/types';
import {blogApi} from "@/features/blog/api";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {PostDetailDict} from "@/types/dict";
import Spinner from "@/components/ui/Spinner";

interface Props {
    initialPost?: Post;
    postId: number;
    baseApiUrl: string;
    dict: PostDetailDict
}

export function PostDetailPage({initialPost, postId, baseApiUrl, dict}: Props) {
    const [post, setPost] = useState<Post | null>(initialPost || null);
    const [isLoading, setIsLoading] = useState<boolean>(!initialPost);
    const [error, setError] = useState<string | null>(null);
    const router = useNavigatingRouter();
    const theme = useTheme();

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

    if (isLoading) return <Spinner/>

    if (error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={() => router.back()} sx={{mt: theme.spacing(2)}}>{dict.goBack}</Button>
            </Box>
        );
    }

    if (!post) return null

    const createMarkup = (htmlString: string) => {
        return {__html: htmlString};
    };

    return (
        <Paper elevation={3}
               sx={{p: {xs: theme.spacing(2), sm: theme.spacing(3)}, borderRadius: theme.shape.borderRadius}}>
            {post.image && (
                <Box sx={{
                    mb: theme.spacing(4),
                    width: '100%',
                    aspectRatio: '16/9',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: theme.shape.borderRadius
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
                    mb: theme.spacing(3),
                    color: 'text.primary',
                    fontSize: {
                        xs: theme.typography.h5.fontSize,
                        sm: theme.typography.h4.fontSize,
                        md: theme.typography.h3.fontSize,
                    },
                }}
            >
                {post.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{mb: theme.spacing(2)}}>
                {dict.published} {new Date(post.created_at).toLocaleDateString()}
            </Typography>

            <Box
                sx={{
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    color: 'text.secondary',
                    '& p': {mb: theme.spacing(1.5)},
                    '& ul, & ol': {ml: theme.spacing(2), mb: theme.spacing(1.5)},
                    '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: theme.shape.borderRadius,
                        my: theme.spacing(2)
                    },
                    '& b': {fontWeight: theme.typography.fontWeightBold},
                    '& i': {fontStyle: 'italic'},
                    '& u': {textDecoration: 'underline'},
                }}
                dangerouslySetInnerHTML={createMarkup(post.content)}
            />
        </Paper>
    );
}