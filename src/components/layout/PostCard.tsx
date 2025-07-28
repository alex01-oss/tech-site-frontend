"use client";

import React from 'react';
import {Box, darken, IconButton, Paper, Typography, useTheme} from '@mui/material';
import Image from 'next/image';
import EditIcon from "@mui/icons-material/Edit";
import {Post} from '@/features/blog/types';
import {useAuthStore} from "@/features/auth/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";

interface PostCardProps {
    post: Post;
    baseApiUrl: string;
    height?: number;
    showAdminControls?: boolean;
    elevation?: number;
    showDescription?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    baseApiUrl,
    height = 300,
    showAdminControls = false,
    elevation = 4,
    showDescription = true,
}) => {
    const router = useNavigatingRouter();
    const { user } = useAuthStore();
    const theme = useTheme();

    return (
        <Paper
            elevation={elevation}
            sx={{
                position: 'relative',
                height: height,
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
                },
            }}
            onClick={() => router.push(`/blog/${post.id}`)}
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

            {showAdminControls && user?.role === 'admin' && (
                <IconButton
                    aria-label="edit post"
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 3,
                        borderRadius: 10,
                        color: 'white',
                        bgcolor: 'primary.main',
                        '&:hover': {
                            bgcolor: darken(theme.palette.primary.main, 0.2),
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/blog/edit/${post.id}`);
                    }}
                >
                    <EditIcon />
                </IconButton>
            )}

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
                {showDescription && (
                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.8,
                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                        }}
                    >
                        {post.content.length > 100 ? `${post.content.replace(/<[^>]*>/g, '').substring(0, 97)}...` : post.content.replace(/<[^>]*>/g, '')}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

export default PostCard;