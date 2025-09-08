"use client"

import {Box, useTheme} from "@mui/material";
import React, {memo} from "react";
import {Product} from "@/features/catalog/types";
import {ProductCard} from "@/components/catalog/ProductCard";
import {useToggleCart} from "@/hooks/useToggleCart";

interface ProductTableProps {
    products: Product[];
    isCartView?: boolean;
}

export const ProductsGrid: React.FC<ProductTableProps> = memo(({products, isCartView = false}) => {
    const {handleToggleCart, isInCart} = useToggleCart();
    const theme = useTheme();

    return (
        <Box
            component="ul"
            sx={{
                display: 'grid',
                gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                    xl: 'repeat(4, 1fr)',
                },
                alignItems: 'stretch',
                listStyle: 'none',
                padding: 0,
                margin: 0,
            }}
        >
            {products.map((product) => (
                <Box 
                    key={`product-${product.id}`} 
                    component="li" 
                    sx={{
                        minWidth: 0,
                        maxWidth: '100%',
                        display: 'flex',
                        height: '100%',
                    }}
                 >
                    <ProductCard
                        product={{...product, is_in_cart: isInCart(product.id)}}
                        isCartView={isCartView}
                        onToggleCart={() => handleToggleCart(product.id)}
                    />
                </Box>
            ))}
        </Box>
    );
});