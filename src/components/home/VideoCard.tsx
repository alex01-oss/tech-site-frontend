"use client"

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import {Video} from "@/features/youtube/types";
import {alpha, useTheme} from "@mui/material";

interface VideoCardProps {
    video: Video,
    onClickAction: (videoId: string) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({video, onClickAction}) => {
    const theme = useTheme();

    return (
        <Paper
            sx={{
                position: 'relative',
                height: 200,
                backgroundImage: `url(${video.snippet.thumbnails.high.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: theme.shape.borderRadius,
            }}
            onClick={() => onClickAction(video.snippet.resourceId.videoId)}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: alpha(theme.palette.common.black, 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <IconButton sx={{
                    color: theme.palette.common.white,
                    '&:hover': {color: theme.palette.primary.main}
                }}>
                    <PlayArrowIcon sx={{fontSize: 60}}/>
                </IconButton>
            </Box>
            <Typography
                variant="subtitle1"
                sx={{
                    position: 'absolute',
                    bottom: theme.spacing(1),
                    left: theme.spacing(1),
                    color: theme.palette.common.white,
                    fontWeight: 'bold',
                    zIndex: 2,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                }}
            >
                {video.snippet.title}
            </Typography>
        </Paper>
    );
};