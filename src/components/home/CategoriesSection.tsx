"use client"

import React from 'react';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {Box, Typography, useTheme} from '@mui/material';
import {useCatalogStore} from "@/features/catalog/store";
import {Category} from "@/features/data/types";
import {API_URL} from "@/constants/constants";
import {useDictionary} from '@/providers/DictionaryProvider';

interface Props {
    categories: Category[]
    error: string | null
}

export const CategoriesSection: React.FC<Props> = ({categories, error}) => {
    const {setCategory} = useCatalogStore();
    const router = useNavigatingRouter();
    const theme = useTheme();
    const dict = useDictionary();

    if (error) {
        return <Typography color="error" align="center" role="alert" aria-live="assertive">
            {dict.sections.categories.loadError} {error}
        </Typography>
    }

    if (!categories || categories.length === 0) {
        return (
            <Typography variant="h6" color="text.secondary" align="center" role="status" aria-live="polite">
                {dict.sections.categories.empty}
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h3" component="h2"
                        sx={{mb: {xs: theme.spacing(1), sm: theme.spacing(2)}, color: 'text.primary'}}>
                {dict.sections.categories.title}
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
                        aria-label={`${dict.sections.categories.view} ${category.name}`}
                    >
                        <Box
                            component="img"
                            src={`${API_URL}/${category.img_url}`}
                            alt={dict.sections.categories.imageAlt.replace('{categoryName}', category.name)}
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