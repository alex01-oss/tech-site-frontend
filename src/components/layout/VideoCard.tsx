import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';
import {Video} from "@/features/youtube/types";

interface VideoCardProps {
    video: Video,
    onClick: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
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
                borderRadius: 2,
            }}
            onClick={() => onClick(video.snippet.resourceId.videoId)}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <IconButton sx={{ color: 'white', '&:hover': { color: 'primary.main' } }}>
                    <PlayArrowIcon sx={{ fontSize: 60 }} />
                </IconButton>
            </Box>
            <Typography
                variant="subtitle1"
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    color: 'white',
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

export default VideoCard;