import React from 'react';
import {Box, Skeleton, useTheme} from '@mui/material';

export const BlogSkeleton = () => {
    const theme = useTheme();

    return (
        <Box>
            <Skeleton
                variant="text"
                width="60%"
                sx={{
                    typography: 'h3',
                    mb: {xs: theme.spacing(1), sm: theme.spacing(2)},
                    mx: 'auto'
                }}
            />
            <Box
                sx={{
                    display: 'grid',
                    gap: {
                        xs: theme.spacing(2),
                        sm: theme.spacing(3)
                    },
                    gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)'
                    },
                    justifyContent: 'center'
                }}
            >
                {[...Array(3)].map((_, index) => (
                    <Box key={index}>
                        <Skeleton variant="rectangular" height={theme.spacing(25)}
                                  sx={{borderRadius: theme.shape.borderRadius}}/>
                    </Box>
                ))}
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'center', mt: {xs: theme.spacing(2), sm: theme.spacing(3)}}}>
                <Skeleton variant="rounded" width={180} height={48}/>
            </Box>
        </Box>
    );
};