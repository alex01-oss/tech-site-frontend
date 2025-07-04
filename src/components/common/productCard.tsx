import {Box, Button, Chip, Typography} from "@mui/material";
import {CheckBox, Delete, ShoppingCart} from "@mui/icons-material";
import React, {memo} from "react";
import {CatalogItem} from "@/features/catalog/types";

interface ProductCardProps {
    product: CatalogItem;
    isCartView?: boolean;
    onToggleCart: (product: CatalogItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
    product,
    isCartView = false,
    onToggleCart
}) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

    return (
        <Box
            sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                transition: theme.transitions.create(
                    ["transform", "box-shadow", "border-color"],
                    {
                        duration: theme.transitions.duration.short,
                    }
                ),
                overflow: "hidden",
                height: "100%",
                border: `2px solid ${product.is_in_cart ? theme.palette.success.main : theme.palette.divider}`,
                position: "relative",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: theme.shadows[8],
                    borderColor: theme.palette.primary.main,
                },
            })}
        >
            {/* STATUS BADGE */}
            {product.is_in_cart && !isCartView && (
                <Box
                    sx={(theme) => ({
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: theme.palette.success.main,
                        color: theme.palette.common.white,
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                    })}
                >
                    <CheckBox sx={{ fontSize: 16 }} />
                </Box>
            )}

            {/* CODE CHIP */}
            <Box
                sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    zIndex: 1,
                }}
            >
                <Chip
                    label={product.code}
                    size="small"
                    sx={(theme) => ({
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.common.white,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                    })}
                />
            </Box>

            {/* IMAGE */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 3,
                    paddingTop: 5,
                    height: 120,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <img
                    src={`${apiUrl}/${product.images}`}
                    alt={product.shape}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                />
            </Box>

            {/* CONTENT */}
            <Box
                sx={{
                    padding: 2.5,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    gap: 1,
                }}
            >
                {/* MAIN TITLE */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: "1.1rem",
                        lineHeight: 1.2,
                    }}
                >
                    {product.shape}
                </Typography>

                {/* INFO GRID */}
                <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Dimens:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {product.dimensions}
                        </Typography>
                    </Box>

                    {product.name_bond && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Bond:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {product.name_bond}
                            </Typography>
                        </Box>
                    )}

                    {product.grid_size && (
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Grid:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {product.grid_size}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ACTION BUTTON */}
                <Box sx={{ mt: "auto", pt: 2 }}>
                    <Button
                        fullWidth
                        variant={isCartView ? "contained" : product.is_in_cart ? "outlined" : "contained"}
                        color={isCartView ? "error" : product.is_in_cart ? "success" : "primary"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleCart(product);
                        }}
                        startIcon={
                            isCartView ? (
                                <Delete />
                            ) : product.is_in_cart ? (
                                <CheckBox />
                            ) : (
                                <ShoppingCart />
                            )
                        }
                        sx={{
                            py: 1,
                            fontWeight: 600,
                            borderRadius: 1.5,
                            textTransform: "none",
                        }}
                    >
                        {isCartView
                            ? "Remove"
                            : product.is_in_cart
                                ? "In cart"
                                : "Add to cart"
                        }
                    </Button>
                </Box>
            </Box>
        </Box>
    )
})