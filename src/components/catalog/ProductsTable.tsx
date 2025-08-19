import {Grid} from "@mui/material";
import React, {memo} from "react";
import {CatalogItem} from "@/features/catalog/types";
import {ProductCard} from "@/components/catalog/ProductCard";
import {useToggleCart} from "@/hooks/useToggleCart";

interface ProductTableProps {
    products: CatalogItem[];
    isCartView?: boolean;
    dict: any
}

export const ProductsTable: React.FC<ProductTableProps> = memo(({ products, isCartView = false, dict }) => {
    const { handleToggleCart, isInCart } = useToggleCart()

    return (
        <Grid container spacing={{xs: 2, sm: 3}}>
            {products.map((product, index) => (
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3} key={`product-${index}`}>
                <ProductCard
                        product={{ ...product, is_in_cart: isInCart(product.id) }}
                        isCartView={isCartView}
                        onToggleCart={() => handleToggleCart(product.id)}
                        dict={dict}
                    />
                </Grid>
            ))}
        </Grid>
    );
});