"use client"

import {Box, Grid, Skeleton, useTheme} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export const BlogSkeleton = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
            {isMobile ? (
                <Grid container spacing={theme.spacing(2)}>
                    {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} key={index}>
                            <Skeleton variant="rectangular" height={theme.spacing(25)}
                                      sx={{borderRadius: theme.shape.borderRadius}}/>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Grid container spacing={theme.spacing(3)} justifyContent="center">
                    {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Skeleton variant="rectangular" height={theme.spacing(25)}
                                      sx={{borderRadius: theme.shape.borderRadius}}/>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Box sx={{display: 'flex', justifyContent: 'center', mt: {xs: theme.spacing(2), sm: theme.spacing(3)}}}>
                <Skeleton variant="rounded" width={180} height={48}/>
            </Box>
        </Box>
    );
}