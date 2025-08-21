import React from "react";
import {Box, Skeleton, useTheme} from "@mui/material";

export const ProductSkeleton = ({count = 12}: { count?: number; }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'grid',
                gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                },
            }}
        >
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <Box key={`skeleton-${index}`}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: theme.shape.borderRadius,
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                overflow: "hidden",
                                height: "100%",
                                position: "relative",
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    px: theme.spacing(2),
                                    py: theme.spacing(1),
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    width={theme.spacing(8.75)}
                                    height={theme.spacing(2.5)}
                                    sx={{borderRadius: theme.shape.borderRadius}}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: theme.spacing(17.5),
                                    padding: theme.spacing(2),
                                    bgcolor: theme.palette.grey[100],
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width={theme.spacing(15)}
                                    height={theme.spacing(15)}
                                    sx={{borderRadius: theme.shape.borderRadius}}
                                />
                            </Box>

                            <Box
                                sx={{
                                    padding: theme.spacing(2),
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    width="90%"
                                    height={theme.spacing(2.75)}
                                    sx={{mb: theme.spacing(1.5)}}
                                />

                                <Box sx={{mb: theme.spacing(2)}}>
                                    <Box sx={{display: "flex", mb: theme.spacing(1), gap: theme.spacing(1)}}>
                                        <Skeleton variant="text" width={theme.spacing(7.5)} height={theme.spacing(2)}/>
                                        <Skeleton variant="text" width="60%" height={theme.spacing(2)}/>
                                    </Box>
                                    <Box sx={{display: "flex", mb: theme.spacing(1), gap: theme.spacing(1)}}>
                                        <Skeleton variant="text" width={theme.spacing(7.5)} height={theme.spacing(2)}/>
                                        <Skeleton variant="text" width="50%" height={theme.spacing(2)}/>
                                    </Box>
                                    <Box sx={{display: "flex", gap: theme.spacing(1)}}>
                                        <Skeleton variant="text" width={theme.spacing(7.5)} height={theme.spacing(2)}/>
                                        <Skeleton variant="text" width="40%" height={theme.spacing(2)}/>
                                    </Box>
                                </Box>

                                <Box sx={{mt: "auto"}}>
                                    <Skeleton
                                        variant="rounded"
                                        width={theme.spacing(12.5)}
                                        height={theme.spacing(4.5)}
                                        sx={{borderRadius: theme.shape.borderRadius}}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
        </Box>
    );
};