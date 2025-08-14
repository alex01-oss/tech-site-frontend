"use client"

import {Box, Button, Chip, Tooltip, Typography, useTheme} from "@mui/material";
import {Delete, Star, StarBorder} from "@mui/icons-material";
import React, {memo} from "react";
import {CatalogItem} from "@/features/catalog/types";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import Image from "next/image";

interface ProductCardProps {
    product: CatalogItem;
    isCartView?: boolean;
    onToggleCart: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = memo(({
    product,
    isCartView = false,
    onToggleCart
}) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";
    const router = useNavigatingRouter();
    const theme = useTheme();

    return (
        <Box
            onClick={() => router.push(`/catalog/${product.id}`)}
            sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
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
            })}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <Chip
                    variant="outlined"
                    label={product.code}
                    size="small"
                    sx={{
                        borderRadius: 1,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                    }}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 140,
                    padding: 2,
                    bgcolor: "grey.25",
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
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        fontSize: "0.95rem",
                        lineHeight: 1.3,
                        mb: 1.5,
                    }}
                >
                    {product.shape}
                </Typography>

                <Box sx={{mb: 2}}>
                    <Box sx={{display: "flex", mb: 1}}>
                        <Typography
                            variant="caption"
                            sx={{
                                minWidth: 60,
                                color: "text.secondary",
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                            }}
                        >
                            SIZE
                        </Typography>
                        <Tooltip
                            title={product.dimensions}
                            placement="top"
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 500,
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
                        <Box sx={{display: "flex", mb: 1}}>
                            <Typography
                                variant="caption"
                                sx={{
                                    minWidth: 60,
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                BOND
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 500,
                                }}
                            >
                                {product.name_bonds.join(', ')}
                            </Typography>
                        </Box>
                    )}


                    {product.grid_size && (
                        <Box sx={{display: "flex"}}>
                            <Typography
                                variant="caption"
                                sx={{
                                    minWidth: 60,
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                GRID
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 500,
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
                                    minWidth: 60,
                                    color: "text.secondary",
                                    textTransform: "uppercase",
                                    letterSpacing: 0.5,
                                }}
                            >
                                FIT
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.primary",
                                    fontWeight: 500,
                                }}
                            >
                                {`${product.mounting.mm} mm / ${product.mounting.inch} ″`}
                            </Typography>
                        </Box>
                    )}

                </Box>

                <Box sx={{mt: "auto"}}>
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
                                <Star sx={{fontSize: 20}}/>
                            ) : (
                                <StarBorder sx={{fontSize: 20}}/>
                            )
                        }
                        sx={{
                            borderRadius: 1,
                            textTransform: "none",
                            fontWeight: 500,
                            px: 1,
                            py: 0.5,
                            minHeight: 'auto',
                            alignSelf: 'flex-start',
                            "&:hover": {
                                bgcolor: "action.hover",
                            },
                        }}
                    >
                        {isCartView
                            ? "Remove"
                            : product.is_in_cart
                                ? "Saved"
                                : "Save"
                        }
                    </Button>
                </Box>
            </Box>
        </Box>
    )
})