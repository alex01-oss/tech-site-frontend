"use client";

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Image from 'next/image';
import { Post } from '@/features/blog/types';

interface PostDetailPageProps {
    post: Post;
    baseApiUrl: string;
}

export default function PostDetailPage({ post, baseApiUrl }: PostDetailPageProps) {
    const createMarkup = (htmlString: string) => {
        return { __html: htmlString };
    };

    return (
        <Container sx={{ my: 2, py: 4, mt: 9, mh: '100%' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                {post.image && (
                    <Box sx={{ mb: 4, width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
                        <Image
                            src={`${baseApiUrl}/${post.image}`}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 600px) 100vw, (max-width: 900px) 80vw, 700px"
                            priority
                        />
                    </Box>
                )}

                <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 3, color: 'text.primary' }}>
                    {post.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Published: {new Date(post.created_at).toLocaleDateString()}
                </Typography>

                <Box
                    sx={{
                        lineHeight: 1.6,
                        fontSize: '1.1rem',
                        color: 'text.secondary',
                        '& p': { mb: 1.5 },
                        '& ul, & ol': { ml: 2, mb: 1.5 },
                        '& img': { maxWidth: '100%', height: 'auto', borderRadius: 1, my: 2 },
                        '& b': { fontWeight: 'bold' },
                        '& i': { fontStyle: 'italic' },
                        '& u': { textDecoration: 'underline' },
                    }}
                    dangerouslySetInnerHTML={createMarkup(post.content)}
                />

            </Paper>
        </Container>
    );
}