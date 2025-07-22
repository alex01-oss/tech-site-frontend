"use client";

import React from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { Post } from '@/features/blog/types';

interface BlogGridProps {
    posts: Post[];
    baseApiUrl: string;
}

export default function BlogGrid({ posts, baseApiUrl }: BlogGridProps) {
    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 6, minHeight: '80vh' }}>
            <Typography variant="h2" component="h1" align="center" sx={{ mb: 6, color: 'text.primary', fontWeight: 700 }}>
                Our Blog
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {posts.length > 0 ? (
                    posts.map((post: Post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Paper
                                elevation={4}
                                sx={{
                                    position: 'relative',
                                    height: 300,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                                    },
                                }}
                                onClick={() => window.location.href = `/blog/${post.id}`}
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 0,
                                }}>
                                    <Image
                                        src={post.image ? `${baseApiUrl}/${post.image}` : '/placeholder-image.png'}
                                        alt={post.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                    />
                                </Box>

                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '60%',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0))',
                                    zIndex: 1,
                                }} />

                                <Box sx={{
                                    position: 'relative',
                                    p: 2,
                                    pt: 4,
                                    zIndex: 2,
                                    color: 'white',
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
                                            mb: 1,
                                        }}
                                    >
                                        {post.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            opacity: 0.8,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                                        }}
                                    >
                                        {post.content.length > 100 ? `${post.content.replace(/<[^>]*>/g, '').substring(0, 97)}...` : post.content.replace(/<[^>]*>/g, '')}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                            No blog posts available yet.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}