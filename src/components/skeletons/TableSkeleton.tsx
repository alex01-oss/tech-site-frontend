import {Box, Grid, Skeleton} from "@mui/material";

interface ProductSkeletonProps {
    count?: number;
}

const ProductSkeleton = ({ count = 8 }: ProductSkeletonProps) => {
    return (
        <Grid container spacing={3}>
            {Array(count)
                .fill(0)
                .map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                        <Box
                            sx={(theme) => ({
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 2,
                                bgcolor: theme.palette.background.paper,
                                boxShadow: theme.shadows[1],
                                overflow: "hidden",
                                height: "100%",
                                border: `2px solid ${theme.palette.divider}`,
                                position: "relative",
                            })}
                        >
                            {/* CODE CHIP SKELETON */}
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 8,
                                    left: 8,
                                    zIndex: 1,
                                }}
                            >
                                <Skeleton
                                    variant="rounded"
                                    width={60}
                                    height={24}
                                    sx={{ borderRadius: "12px" }}
                                />
                            </Box>

                            {/* IMAGE SKELETON */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: 3,
                                    paddingTop: 5,
                                    height: 120,
                                    borderBottom: "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width={80}
                                    height={80}
                                    sx={{ borderRadius: 1 }}
                                />
                            </Box>

                            {/* CONTENT SKELETON */}
                            <Box
                                sx={{
                                    padding: 2.5,
                                    display: "flex",
                                    flexDirection: "column",
                                    flexGrow: 1,
                                    gap: 1,
                                }}
                            >
                                {/* MAIN TITLE SKELETON */}
                                <Skeleton
                                    variant="text"
                                    width="80%"
                                    height={28}
                                    sx={{ fontSize: "1.1rem" }}
                                />

                                {/* INFO GRID SKELETON */}
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Skeleton variant="text" width="40%" height={16} />
                                        <Skeleton variant="text" width="35%" height={16} />
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Skeleton variant="text" width="30%" height={16} />
                                        <Skeleton variant="text" width="45%" height={16} />
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Skeleton variant="text" width="25%" height={16} />
                                        <Skeleton variant="text" width="30%" height={16} />
                                    </Box>
                                </Box>

                                {/* ACTION BUTTON SKELETON */}
                                <Box sx={{ mt: "auto", pt: 2 }}>
                                    <Skeleton
                                        variant="rounded"
                                        width="100%"
                                        height={42}
                                        sx={{ borderRadius: 1.5 }}
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