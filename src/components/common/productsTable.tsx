import {Grid} from "@mui/material";
import {useSnackbar} from "notistack";
import React, {memo} from "react";
import {useAuthStore} from "@/features/auth/store";
import {useCartStore} from "@/features/cart/store";
import {CatalogItem} from "@/features/catalog/types";
import {ProductCard} from "@/components/common/productCard";

interface ProductTableProps {
    products: CatalogItem[];
    isCartView?: boolean;
}

const ProductsTable: React.FC<ProductTableProps> = memo(({ products, isCartView = false }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { toggleCartItem, isInCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    const handleToggleCart = async (product: CatalogItem) => {
        if (!isAuthenticated) {
            enqueueSnackbar("You must be logged in", { variant: "error" });
            return;
        }

        try {
            await toggleCartItem(product);
            enqueueSnackbar(
                isInCart(product.code) ? "Added to cart" : "Removed from cart",
                { variant: isInCart(product.code) ? "success" : "info" }
            );
        } catch {
            enqueueSnackbar("Error updating cart", { variant: "error" });
        }
    };

    return (
        <Grid container spacing={3}>
            {products.map((product, index) => (
                <Grid item xs={6} sm={6} md={6} lg={4} xl={3} key={`product-${index}`}>
                    <ProductCard
                        product={{ ...product, is_in_cart: isInCart(product.code) }}
                        isCartView={isCartView}
                        onToggleCart={handleToggleCart}
                    />
                </Grid>
            ))}
        </Grid>
    );
});

export default ProductsTable;
