"use client"

import {Box, Button, Chip, Stack, Typography, useTheme} from "@mui/material";
import {AddShoppingCart, Delete, ShoppingCart} from "@mui/icons-material";
import React, {memo} from "react";
import {Product} from "@/features/catalog/types";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import Image from "next/image";
import {API_URL} from "@/constants/constants";
import {useDictionary} from "@/providers/DictionaryProvider";
import {ProductDetailRow} from "@/components/catalog/DetailRow";

interface Props {
    product: Product;
    isCartView?: boolean;
    onToggleCart: (id: number) => void;
}

export const ProductCard: React.FC<Props> = memo(({
    product,
    isCartView = false,
    onToggleCart,
}) => {
    const router = useNavigatingRouter();
    const dict = useDictionary();
    const theme = useTheme();

    return (
        <Box
            onClick={() => router.push(`/catalog/${product.id}`)}
            sx={{
                height: '380px',
                display: "flex",
                flexDirection: "column",
                borderRadius: theme.shape.borderRadius,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                transition: theme.transitions.create(
                    ["border-color", "box-shadow"],
                    {duration: theme.transitions.duration.short}
                ),
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                "&:hover": {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                },
                ...(product.is_in_cart && {
                    borderColor: theme.palette.success.main,
                    borderWidth: 2,
                }),
            }}
            role="link"
            tabIndex={0}
            aria-label={`${dict.catalog.product.viewProduct} ${product.shape}`}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: theme.spacing(2),
                    py: theme.spacing(1),
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Chip
                    variant="outlined"
                    label={product.code}
                    size="small"
                    sx={{
                        borderRadius: theme.shape.borderRadius,
                        fontWeight: theme.typography.fontWeightBold,
                        fontSize: "0.75rem",
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: theme.spacing(17.5),
                    maxHeight: theme.spacing(25),
                    padding: theme.spacing(2),
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Image
                    src={`${API_URL}/${product.images}`}
                    alt={dict.catalog.product.imageAlt.replace('{productName}', product.shape)}
                    height={300}
                    width={300}
                    loading="lazy"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>

            <Stack
                spacing={1.5}
                sx={{
                    padding: theme.spacing(2),
                    flexGrow: 1,
                }}
            >
                <Typography
                    variant="subtitle2"
                    component="h3"
                    sx={{
                        fontWeight: theme.typography.fontWeightBold,
                        color: "text.primary",
                        fontSize: "0.95rem",
                        lineHeight: 1.3,
                    }}
                >
                    {product.shape}
                </Typography>

                <Stack spacing={1}>
                    <ProductDetailRow
                        label={dict.catalog.card.size}
                        value={product.dimensions}
                        tooltip={product.dimensions}
                    />
                    {product.name_bonds && product.name_bonds.length > 0 && (
                        <ProductDetailRow
                            label={dict.catalog.card.bond}
                            value={product.name_bonds.join(', ')}
                        />
                    )}
                    {product.grid_size && (
                        <ProductDetailRow
                            label={dict.catalog.card.grid}
                            value={product.grid_size}
                        />
                    )}
                    {product.mounting && (
                        <ProductDetailRow
                            label={dict.catalog.card.fit}
                            value={`${product.mounting.mm} ${dict.common.mm} / ${product.mounting.inch}″`}
                        />
                    )}
                </Stack>
            </Stack>

            <Box sx={{
                mt: 'auto',
                padding: theme.spacing(2),
                paddingTop: 0,
            }}>
                <Button
                    fullWidth
                    variant="contained"
                    color={isCartView ? "error" : product.is_in_cart ? "success" : "primary"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleCart(product.id);
                    }}
                    startIcon={
                        isCartView ? (
                            <Delete sx={{fontSize: 20}}/>
                        ) : product.is_in_cart ? (
                            <ShoppingCart sx={{fontSize: 20}}/>
                        ) : (
                            <AddShoppingCart sx={{fontSize: 20}}/>
                        )
                    }
                    sx={{
                        borderRadius: theme.shape.borderRadius,
                        textTransform: "none",
                        fontWeight: theme.typography.fontWeightMedium,
                        px: theme.spacing(1),
                        py: theme.spacing(0.5),
                        minHeight: 'auto',
                        alignSelf: 'flex-start',
                        "&:hover": {
                            bgcolor: theme.palette.primary.dark,
                        },
                    }}
                    aria-label={
                        isCartView
                            ? dict.common.remove
                            : product.is_in_cart
                                ? dict.catalog.product.inCart
                                : dict.common.add
                    }
                >
                    {isCartView
                        ? dict.common.remove
                        : product.is_in_cart
                            ? dict.catalog.product.inCart
                            : dict.common.add
                    }
                </Button>
            </Box>
        </Box>
    )
})