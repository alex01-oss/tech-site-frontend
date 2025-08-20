"use client"

import React, {useEffect} from 'react';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {Box, Grid, Typography, useTheme} from '@mui/material';
import {useDataStore} from "@/features/data/store";
import {useCatalogStore} from "@/features/catalog/store";

interface Props {
    dict: {
        title: string,
        loadError: string,
    }
}

export const CategoriesSection: React.FC<Props> = ({dict}) => {
    const theme = useTheme();
    const {categories, categoriesLoading, categoriesError, fetchCategories} = useDataStore();
    const {setCategory} = useCatalogStore();
    const router = useNavigatingRouter();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

    useEffect(() => {
        void fetchCategories();
    }, [fetchCategories]);

    if (categoriesLoading) {
        const placeholders = Array.from({length: 2});
        return (
            <Box>
                <Typography variant="h3" component="h2"
                            sx={{mb: {xs: theme.spacing(2), sm: theme.spacing(3)}, color: 'text.primary'}}>
                    {dict.title}
                </Typography>
                <Grid container spacing={{xs: theme.spacing(2), sm: theme.spacing(3)}} justifyContent="center">
                    {placeholders.map((_, i) => (
                        <Grid item xs={12} md={6} key={i}>
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 220,
                                    borderRadius: theme.shape.borderRadius,
                                    backgroundColor: theme.palette.action.hover,
                                    overflow: 'hidden',
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    if (categoriesError) {
        return (
            <Typography color="error">{dict.loadError} {categoriesError}</Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h3" component="h2"
                        sx={{mb: {xs: theme.spacing(1), sm: theme.spacing(2)}, color: 'text.primary'}}>
                {dict.title}
            </Typography>
            <Grid container spacing={{xs: theme.spacing(2), sm: theme.spacing(3)}} justifyContent="center">
                {categories.map((category) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        key={category.id}
                        onClick={() => {
                            setCategory(category.id, category.name);
                            router.push(`/catalog?category_id=${category.id}`);
                        }}
                        sx={{cursor: 'pointer'}}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                borderRadius: theme.shape.borderRadius,
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
                                    display: 'block',
                                }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};