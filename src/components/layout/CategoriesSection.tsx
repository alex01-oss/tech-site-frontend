'use client'

import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {useRouter} from "next/navigation";

const categories = [
    'SHARPENING TOOL',
    'AXIAL TOOL',
    'GRINDING TOOL',
    'CONSTRUCTION TOOL',
];

const CategoriesSection: React.FC = () => {
    const router = useRouter();

    return (
        <Container maxWidth="lg" sx={{ my: 6 }}>
            <Typography variant="h3" component="h2" sx={{ mb: 4, color: 'text.primary' }}>
                Product Categories
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {categories.map((category) => (
                    <Grid item xs={12} sm={6} md={3} key={category}>
                        <Button
                            variant="outlined"
                            onClick={() => router.push("/catalog")}
                            sx={{
                                width: '100%',
                                py: 2,
                                borderColor: 'primary.main',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                '&:hover': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderColor: 'primary.main',
                                },
                            }}
                        >
                            {category}
                        </Button>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default CategoriesSection;