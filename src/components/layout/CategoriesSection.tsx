"use client"

import React, {useEffect} from 'react';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {Box, CircularProgress, Container, Grid, Typography} from '@mui/material';
import {useDataStore} from "@/features/data/store";

const CategoriesSection: React.FC = () => {
    const router = useNavigatingRouter();

    const { categories, categoriesLoading, categoriesError, fetchCategories } = useDataStore();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    if (categoriesLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (categoriesError) {
        return (
            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Typography color="error">Failed to load categories: {categoriesError}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 6 }}>
            <Typography variant="h3" component="h2" sx={{ mb: 4, color: 'text.primary' }}>
                Product Categories
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {categories.map((category) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        key={category.name}
                        onClick={() => router.push(`/catalog?category=${category.name}`)}
                        sx={{ cursor: 'pointer' }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                borderRadius: 1,
                                overflow: 'hidden',
                                '&:hover img': {
                                    transform: 'scale(1.05)',
                                    transition: 'transform .3s ease-in-out',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={`${apiUrl}/${category.img_url}`}
                                alt={category.name}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform .3s ease-in-out',
                                }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CategoriesSection;