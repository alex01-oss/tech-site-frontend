"use client"

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import {Video} from "@/features/youtube/types";
import {alpha, useTheme} from "@mui/material";
import {VideoCardDict} from "@/types/dict";

interface VideoCardProps {
    video: Video,
    onClickAction: (videoId: string) => void;
    dict: VideoCardDict
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClickAction, dict }) => {
    const theme = useTheme();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            onClickAction(video.snippet.resourceId.videoId);
        }
    };

    return (
        <Box
            onClick={() => onClickAction(video.snippet.resourceId.videoId)}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`${dict.playVideo} ${video.snippet.title}`}
            sx={{
                position: 'relative',
                height: 200,
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: theme.shape.borderRadius,
            }}
        >
            <Box
                component="img"
                src={video.snippet.thumbnails.high.url}
                alt={`${dict.videoThumbnail} ${video.snippet.title}`}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1,
                }}
            />

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
                    zIndex: 2,
                }}
            >
                <IconButton sx={{
                    color: theme.palette.common.white,
                    '&:hover': { color: theme.palette.primary.main }
                }} aria-hidden="true" tabIndex={-1}>
                    <PlayArrowIcon sx={{ fontSize: 60 }} />
                </IconButton>
            </Box>

            <Typography
                variant="subtitle1"
                component="h3"
                sx={{
                    position: 'absolute',
                    bottom: theme.spacing(1),
                    left: theme.spacing(1),
                    color: theme.palette.common.white,
                    fontWeight: 'bold',
                    zIndex: 3,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                }}
            >
                {video.snippet.title}
            </Typography>
        </Box>
    );
};