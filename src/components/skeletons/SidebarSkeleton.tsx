import React from 'react';
import {Box, Skeleton, useTheme} from '@mui/material';

interface FiltersSkeletonProps {
    isMobileDrawer?: boolean;
}

const FiltersSkeleton: React.FC<FiltersSkeletonProps> = ({isMobileDrawer = false}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                mt: 4,
                width: {xs: '100%', sm: 256},
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'stretch',
                overflowY: 'auto',
                ...(isMobileDrawer ? {
                    py: 2,
                    px: 2,
                } : {
                    minWidth: 256,
                    maxHeight: 'calc(100vh - 64px)',
                    position: 'sticky',
                    top: theme.mixins.toolbar.minHeight as number,
                    backgroundColor: theme.palette.background.default,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    overflowX: 'hidden',
                }),
            }}
        >
            {isMobileDrawer && (
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{mb: 2, px: 2}}>
                    <Skeleton variant="text" width={80} height={24}/>
                    <Skeleton variant="circular" width={24} height={24}/>
                </Box>
            )}

            {[...Array(3)].map((_, categoryIndex) => (
                <Box key={categoryIndex}>
                    <Box sx={{
                        px: {xs: 2, sm: 0},
                        py: {xs: 0, sm: 1}
                    }}>
                        {isMobileDrawer ? (
                            <Box sx={{mb: 1}}>
                                <Skeleton variant="text" width="80%" height={24} sx={{fontWeight: 'bold'}}/>
                                <Skeleton variant="rectangular" width="100%" height={1} sx={{my: 1}}/>
                            </Box>
                        ) : (
                            <Box sx={{py: 1, ml: 2}}>
                                <Skeleton variant="text" width={100} height={20}/>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{pl: {xs: 2, sm: 4}}}>
                        {[...Array(4 - categoryIndex)].map((_, itemIndex) => (
                            <Box
                                key={itemIndex}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: {xs: 0, sm: 0.5},
                                    mb: {xs: 0.5, sm: 0},
                                    gap: 1
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width={18}
                                    height={18}
                                    sx={{borderRadius: 0.5}}
                                />
                                <Skeleton
                                    variant="text"
                                    width={Math.random() * 60 + 60}
                                    height={20}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}

            {isMobileDrawer && (
                <Box sx={{mt: 2, display: 'flex', gap: 1, px: 2}}>
                    <Skeleton variant="rectangular" width="100%" height={40} sx={{borderRadius: 1}}/>
                </Box>
            )}
        </Box>
    );
};

export default FiltersSkeleton;