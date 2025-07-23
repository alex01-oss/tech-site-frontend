import React from 'react'
import {Paper, Typography} from "@mui/material";
import {Post} from '@/features/blog/types';
import { useRouter } from 'next/navigation';

interface PostCardProps {
    post: Post;
    baseApiUrl: string;
}
const PostCard: React.FC<PostCardProps> = ( { post, baseApiUrl }) => {
    const router = useRouter();

    return (
        <Paper
            sx={{
                position: 'relative',
                height: 200,
                backgroundImage: `url(${post.image ? `${baseApiUrl}/${post.image}` : '/placeholder-image.png'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 2,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                    zIndex: 1,
                }
            }}
            onClick={() => router.push(`/blog/${post.id}`)}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    position: 'relative',
                    bottom: 8,
                    left: 8,
                    color: 'white',
                    fontWeight: 'bold',
                    zIndex: 2,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                    p: 1,
                }}
            >
                {post.title}
            </Typography>
        </Paper>
    )
}

export default PostCard