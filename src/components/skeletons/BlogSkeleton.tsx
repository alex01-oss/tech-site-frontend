import {Grid, Skeleton } from "@mui/material";

export default function BlogSkeleton() {
    return (
        <Grid container spacing={3}>
            {[...Array(3)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.5rem', mt: 1 }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: '60%' }} />
                </Grid>
            ))}
        </Grid>
    );
}