"use client"

import React, {useEffect} from 'react';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {Box, Typography, useTheme} from '@mui/material';
import {useDataStore} from "@/features/data/store";
import {useCatalogStore} from "@/features/catalog/store";
import {Category} from "@/features/data/types";
import {CategoriesSectionDict} from "@/types/dict";
import {API_URL} from "@/constants/constants";

export const CategoriesSection: React.FC<{ dict: CategoriesSectionDict }> = ({dict}) => {
    const {categories, categoriesLoading, categoriesError, fetchCategories} = useDataStore();
    const {setCategory} = useCatalogStore();
    const router = useNavigatingRouter();
    const theme = useTheme();

    useEffect(() => {
        void fetchCategories();
    }, []);

    if (categoriesLoading) {
        const placeholders = Array.from({length: 2});
        return (
            <Box>
                <Typography variant="h3" component="h2"
                            sx={{mb: {xs: theme.spacing(2), sm: theme.spacing(3)}, color: 'text.primary'}}>
                    {dict.title}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center',
                        gap: { xs: theme.spacing(2), sm: theme.spacing(3) }
                    }}
                    role="status"
                    aria-label={dict.loadingCategories}
                    aria-live="polite"
                >
                    {placeholders.map((_, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: { xs: '100%', md: '50%' },
                                maxWidth: 600,
                                height: 220,
                                borderRadius: theme.shape.borderRadius,
                                backgroundColor: theme.palette.action.hover,
                                overflow: 'hidden',
                            }}
                        />
                    ))}
                </Box>
            </Box>
        );
    }

    if (categoriesError) {
        return <Typography color="error" align="center" role="alert" aria-live="assertive">
            {dict.loadError} {categoriesError}
        </Typography>
    }

    return (
        <Box>
            <Typography variant="h3" component="h2"
                        sx={{mb: {xs: theme.spacing(1), sm: theme.spacing(2)}, color: 'text.primary'}}>
                {dict.title}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    gap: { xs: theme.spacing(2), sm: theme.spacing(3) }
                }}
            >
                {categories.map((category: Category) => (
                    <Box
                        key={category.id}
                        onClick={() => {
                            setCategory(category.id, category.name);
                            router.push(`/catalog?category_id=${category.id}`);
                        }}
                        sx={{
                            cursor: 'pointer',
                            position: 'relative',
                            width: { xs: '100%', md: '50%' },
                            maxWidth: 600,
                            borderRadius: theme.shape.borderRadius,
                            overflow: 'hidden',
                            '&:hover img': {
                                transform: 'scale(1.05)',
                                transition: 'transform .3s ease-in-out',
                            },
                        }}
                        component="a"
                        href={`/catalog?category_id=${category.id}`}
                        aria-label={`${dict.viewCategory} ${category.name}`}
                    >
                        <Box
                            component="img"
                            src={`${API_URL}/${category.img_url}`}
                            alt={dict.categoryImageAlt.replace('{categoryName}', category.name)}
                            sx={{
                                width: '100%',
                                objectFit: 'cover',
                                transition: 'transform .3s ease-in-out',
                                display: 'block',
                            }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};