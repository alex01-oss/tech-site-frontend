"use client"

import React from 'react';
import {Box, Skeleton, useTheme} from '@mui/material';

interface Props {
    dict: { loadingFilters: string }
    isMobileDrawer?: boolean;
}

export const FiltersSkeleton: React.FC<Props> = ({
    isMobileDrawer = false, dict
}) => {
    const theme = useTheme();
    const toolbarHeight = theme.mixins.toolbar.minHeight as number;
    const minWidthNumber = parseInt(theme.spacing(7.5).toString());
    const minHeightNumber = parseInt(theme.spacing(2.5).toString());

    return (
        <Box
            role="status"
            aria-live="polite"
            aria-label={dict.loadingFilters}
            sx={{
                width: {xs: '100%', sm: theme.spacing(32)},
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing(2),
                alignItems: 'stretch',
                overflowY: 'auto',
                ...(isMobileDrawer ? {} : {
                    minWidth: theme.spacing(32),
                    position: 'sticky',
                    height: `calc(100vh - ${toolbarHeight}px)`,
                    top: toolbarHeight,
                    backgroundColor: theme.palette.background.default,
                    borderRight: `1px solid ${theme.palette.divider}`,
                    px: 0,
                    py: 0,
                    overflowX: 'hidden',
                }),
            }}
        >
            {isMobileDrawer && (
                <Box display="flex" justifyContent="space-between" alignItems="center"
                     sx={{mb: theme.spacing(1), px: theme.spacing(0)}}>
                    <Skeleton variant="text" width={theme.spacing(10)} height={theme.spacing(3)}/>
                    <Skeleton variant="circular" width={theme.spacing(3)} height={theme.spacing(3)}/>
                </Box>
            )}

            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {[...Array(3)].map((_, categoryIndex) => (
                    <Box component="li" key={categoryIndex}>
                        {isMobileDrawer ? (
                            <Box sx={{mb: theme.spacing(2), px: theme.spacing(2)}}>
                                <Skeleton variant="text" width="80%" sx={{fontWeight: 'bold'}}/>
                                <Skeleton variant="rectangular" width="100%" height={1} sx={{my: theme.spacing(1)}}/>
                            </Box>
                        ) : (
                            <Box sx={{py: theme.spacing(1), ml: theme.spacing(2)}}>
                                <Skeleton variant="text" width={theme.spacing(12.5)} height={theme.spacing(2.5)}/>
                            </Box>
                        )}
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, pl: isMobileDrawer ? 0 : theme.spacing(4) }}>
                            {[...Array(4 - categoryIndex)].map((_, itemIndex) => (
                                <Box
                                    component="li"
                                    key={itemIndex}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        py: isMobileDrawer ? 0 : theme.spacing(0.5),
                                        mb: isMobileDrawer ? theme.spacing(0.5) : 0,
                                        gap: theme.spacing(1)
                                    }}
                                >
                                    <Skeleton
                                        variant="rectangular"
                                        width={theme.spacing(2.25)}
                                        height={theme.spacing(2.25)}
                                        sx={{borderRadius: theme.shape.borderRadius}}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width={Math.random() * minWidthNumber + minWidthNumber}
                                        height={minHeightNumber}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>

            {isMobileDrawer && (
                <Box sx={{mt: theme.spacing(2), display: 'flex', gap: theme.spacing(1), px: theme.spacing(2)}}>
                    <Skeleton variant="rounded" width="100%" height={theme.spacing(5)}
                              sx={{borderRadius: theme.shape.borderRadius}}/>
                </Box>
            )}
        </Box>
    );
};