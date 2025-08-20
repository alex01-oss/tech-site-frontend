"use client"

import {Box, Button, Chip, Tooltip, Typography, useTheme} from "@mui/material";
import {AddShoppingCart, Delete, ShoppingCart} from "@mui/icons-material";
import React, {memo} from "react";
import {CatalogItem} from "@/features/catalog/types";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import Image from "next/image";
import {ProductCardDict} from "@/types/dict";

interface Props {
    product: CatalogItem;
    isCartView?: boolean;
    onToggleCart: (id: number) => void;
    dict: ProductCardDict
}

export const ProductCard: React.FC<Props> = memo(({
    product,
    isCartView = false,
    onToggleCart,
    dict
}) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";
    const router = useNavigatingRouter();
    const theme = useTheme();

    return (
        <Box
            onClick={() => router.push(`/catalog/${product.id}`)}
            sx={{
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
                height: "100%",
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
                    height: theme.spacing(17.5),
                    padding: theme.spacing(2),
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <Image
                    src={`${apiUrl}/${product.images}`}
                    alt={product.shape}
                    height={300}
                    width={300}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>

            <Box
                sx={{
                    padding: theme.spacing(2),
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: theme.typography.fontWeightBold,
                        color: "text.primary",
                        fontSize: "0.95rem",
                        lineHeight: 1.3,
                        mb: theme.spacing(1.5),
                    }}
                >
                    {product.shape}
                </Typography>

                <Box sx={{mb: theme.spacing(2)}}>
                    <Box sx={{display: "flex", mb: theme.spacing(1)}}>
                        <Typography
                            variant="caption"
                            sx={{
                                minWidth: {xs: 65, sm: 75},
                                color: "text.secondary",
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                            }}
                        >
                            {dict.size}
                        </Typography>
                        <Tooltip
                            title={product.dimensions}
                            placement="top"
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: theme.typography.fontWeightMedium,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    flexGrow: 1,
                                }}
                            >
                                {product.dimensions}
                            </Typography>
                        </Tooltip>
                    </Box>

                    {product.name_bonds && product.name_bonds.length > 0 && (
                        <Box sx={{display: "flex", mb: theme.spacing(1)}}>
                            <Typography
                                variant="caption"
                                sx={{
                                    minWidth: {xs: 65, sm: 75},
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {dict.bond}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: theme.typography.fontWeightMedium,
                                }}
                            >
                                {product.name_bonds.join(', ')}
                            </Typography>
                        </Box>
                    )}


                    {product.grid_size && (
                        <Box sx={{display: "flex", mb: theme.spacing(1)}}>
                            <Typography
                                variant="caption"
                                sx={{
                                    minWidth: {xs: 65, sm: 75},
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {dict.grid}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: theme.typography.fontWeightMedium,
                                }}
                            >
                                {product.grid_size}
                            </Typography>
                        </Box>
                    )}

                    {product.mounting && (
                        <Box sx={{display: "flex"}}>
                            <Typography
                                variant="caption"
                                sx={{
                                    minWidth: {xs: 65, sm: 75},
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                {dict.fit}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: theme.typography.fontWeightMedium,
                                }}
                            >
                                {`${product.mounting.mm} ${dict.mm} / ${product.mounting.inch}″`}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{mt: 'auto'}}>
                    <Button
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
                    >
                        {isCartView
                            ? dict.remove
                            : product.is_in_cart
                                ? dict.inCart
                                : dict.add
                        }
                    </Button>
                </Box>
            </Box>
        </Box>
    )
})