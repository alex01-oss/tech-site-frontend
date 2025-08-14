import React from "react";
import {Box, Grid, Skeleton, useTheme} from "@mui/material";

interface ProductSkeletonProps {
    count?: number;
}

const ProductSkeleton = ({ count = 12 }: ProductSkeletonProps) => {
    const theme = useTheme();

    return (
        <Grid container spacing={2}>
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} xl={3} key={`skeleton-${index}`}>
                        <Box
                            sx={(theme) => ({
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 1,
                                bgcolor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                overflow: "hidden",
                                height: "100%",
                                position: "relative",
                            })}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    px: 2,
                                    py: 1,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    width={70}
                                    height={20}
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 140,
                                    padding: 2,
                                    bgcolor: "grey.25",
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width={120}
                                    height={120}
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    padding: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                }}
                            >
                                <Skeleton
                                    variant="text"
                                    width="90%"
                                    height={22}
                                    sx={{ mb: 1.5 }}
                                />

                                <Box sx={{mb: 2}}>
                                    <Box sx={{ display: "flex", mb: 1, gap: 1 }}>
                                        <Skeleton variant="text" width={60} height={16} />
                                        <Skeleton variant="text" width="60%" height={16} />
                                    </Box>
                                    <Box sx={{ display: "flex", mb: 1, gap: 1 }}>
                                        <Skeleton variant="text" width={60} height={16} />
                                        <Skeleton variant="text" width="50%" height={16} />
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Skeleton variant="text" width={60} height={16} />
                                        <Skeleton variant="text" width="40%" height={16} />
                                    </Box>
                                </Box>

                                <Box sx={{ mt: "auto" }}>
                                    <Skeleton
                                        variant="rounded"
                                        width={100}
                                        height={36}
                                        sx={{ borderRadius: 1 }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                ))}
        </Grid>
    );
};

export default ProductSkeleton;