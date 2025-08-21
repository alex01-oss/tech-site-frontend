"use client"

import {Box, useTheme} from "@mui/material";
import React, {memo} from "react";
import {CatalogItem} from "@/features/catalog/types";
import {ProductCard} from "@/components/catalog/ProductCard";
import {useToggleCart} from "@/hooks/useToggleCart";

interface ProductTableProps {
    products: CatalogItem[];
    isCartView?: boolean;
    dict: any
}

export const ProductsTable: React.FC<ProductTableProps> = memo(({products, isCartView = false, dict}) => {
    const {handleToggleCart, isInCart} = useToggleCart();
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'grid',
                gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                    xl: 'repeat(4, 1fr)',
                },
            }}
        >
            {products.map((product, index) => (
                <Box key={`product-${index}`}>
                    <ProductCard
                        product={{...product, is_in_cart: isInCart(product.id)}}
                        isCartView={isCartView}
                        onToggleCart={() => handleToggleCart(product.id)}
                        dict={dict}
                    />
                </Box>
            ))}
        </Box>
    );
});