import {Grid} from "@mui/material";
import React, {memo} from "react";
import {CatalogItem} from "@/features/catalog/types";
import {ProductCard} from "@/components/common/productCard";
import {useToggleCart} from "@/hooks/useToggleCart";

interface ProductTableProps {
    products: CatalogItem[];
    isCartView?: boolean;
}

const ProductsTable: React.FC<ProductTableProps> = memo(({ products, isCartView = false }) => {
    const { handleToggleCart, isInCart } = useToggleCart()

    return (
        <Grid container spacing={3}>
            {products.map((product, index) => (
                <Grid item xs={6} sm={6} md={6} lg={4} xl={3} key={`product-${index}`}>
                    <ProductCard
                        product={{ ...product, is_in_cart: isInCart(product.code) }}
                        isCartView={isCartView}
                        onToggleCart={() => handleToggleCart(product)}
                    />
                </Grid>
            ))}
        </Grid>
    );
});

export default ProductsTable;