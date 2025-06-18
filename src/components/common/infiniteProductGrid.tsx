import React from 'react';
import {Box, Button, CircularProgress, Grid, Typography} from '@mui/material';
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";
import {useIntersectionObserver} from "@/hooks/useIntersectionObserver";
import {ProductCard} from "@/components/common/productCard";
import ProductSkeleton from "@/components/skeletons/TableSkeleton";
import {CatalogItem} from "@/features/catalog/types";

interface InfiniteProductGridProps {
    fetchProducts: (page: number) => Promise<{ data: []; totalPages: number; totalItems: number }>;
    isCartView?: boolean;
    onToggleCart: (product: CatalogItem) => void;
    isInCart: (code: string) => boolean;
}

export const InfiniteProductGrid: React.FC<InfiniteProductGridProps> = ({
    fetchProducts,
    isCartView = false,
    onToggleCart,
    isInCart
}) => {
    const {
        data: products,
        loading,
        error,
        hasMore,
        loadMore,
        refresh,
        totalItems
    } = useInfiniteScroll({
        fetchData: fetchProducts,
        pageSize: 20
    });

    const { targetRef } = useIntersectionObserver({
        onIntersect: loadMore,
        enabled: hasMore && !loading,
        rootMargin: '200px'
    });

    const handleToggleCart = (product: CatalogItem) => {
        onToggleCart(product);
    };

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="error" variant="h6" gutterBottom>
                    Loading error
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {error}
                </Typography>
                <Button variant="contained" onClick={refresh}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {totalItems > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Showing {products.length} from {totalItems} products
                </Typography>
            )}

            <Grid container spacing={3}>
                {products.map((product: CatalogItem, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`product-${product.code}-${index}`}>
                        <ProductCard
                            product={{ ...product, is_in_cart: isInCart(product.code) }}
                            isCartView={isCartView}
                            onToggleCart={handleToggleCart}
                        />
                    </Grid>
                ))}

                {loading && products.length === 0 && (
                    <ProductSkeleton count={8} />
                )}
            </Grid>

            {loading && products.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                </Box>
            )}

            {hasMore && !loading && (
                <div ref={targetRef} style={{ height: '20px', margin: '20px 0' }} />
            )}

            {!hasMore && products.length > 0 && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Loaded all products.
                    </Typography>
                </Box>
            )}

            {!loading && products.length === 0 && !error && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Products not found.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};