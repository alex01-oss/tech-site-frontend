"use client";

import React from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {Build, CheckBox, Delete, InfoOutlined, ShoppingCart} from "@mui/icons-material";
import {ProductDetailData} from "@/features/catalog/types";
import {useToggleCart} from "@/hooks/useToggleCart";

interface ProductDetailPageProps {
    productData: ProductDetailData;
}

function ProductDetailPage({ productData }: ProductDetailPageProps) {
    const { item, bond, machines } = productData;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";
    const imageUrl = `${apiUrl}/${item.images}`;

    const { handleToggleCart, isInCart } = useToggleCart();

    const inCart = isInCart(item.code);

    return (
        <Box
            sx={{
                mt: 6,
                maxWidth: 'lg',
                mx: 'auto',
                py: { xs: 3, md: 6 },
                px: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 3, md: 5 },
            }}
        >
            <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 2, md: 4 } }}>
                <Grid container spacing={{ xs: 3, md: 5 }}>
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3,
                                pb: { xs: 2, md: 0 }
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: isMobile ? 200 : 300,
                                    maxHeight: 300,
                                    bgcolor: theme.palette.grey[100],
                                    borderRadius: 2,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <img
                                    src={imageUrl}
                                    alt={`${item.shape} ${item.code}`}
                                    style={{
                                        maxWidth: "90%",
                                        maxHeight: "90%",
                                        objectFit: "contain",
                                        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
                                    }}
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder-image.png';
                                    }}
                                />
                            </Box>

                            <Button
                                fullWidth
                                variant={inCart ? "contained" : item.is_in_cart ? "outlined" : "contained"}
                                color={inCart ? "error" : item.is_in_cart ? "success" : "primary"}
                                onClick={() => handleToggleCart(item)}
                                startIcon={
                                    inCart ? (
                                        <Delete />
                                    ) : item.is_in_cart ? (
                                        <CheckBox />
                                    ) : (
                                        <ShoppingCart />
                                    )
                                }
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: "none",
                                }}
                            >
                                {inCart
                                    ? "Remove from Cart"
                                    : item.is_in_cart
                                        ? "In Cart"
                                        : "Add to Cart"
                                }
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.primary",
                                    lineHeight: 1.2,
                                    mb: 1
                                }}
                            >
                                {item.shape}
                            </Typography>
                            <Chip
                                label={`Code: ${item.code}`}
                                size="medium"
                                sx={(theme) => ({
                                    bgcolor: theme.palette.primary.light,
                                    color: theme.palette.primary.contrastText,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    py: 1,
                                    px: 1.5,
                                    height: 'auto',
                                    alignSelf: 'flex-start',
                                })}
                            />

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                                    Key Specifications
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Dimensions: {item.dimensions}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Bond: {item.name_bond}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            Grid Size: {item.grid_size}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {bond && (
                <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 2, md: 4 } }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                        Bond Details: {bond.name_bond}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        {bond.bond_description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <InfoOutlined color="action" />
                        <Typography variant="body2" color="text.secondary">
                            Cooling: {bond.bond_cooling}
                        </Typography>
                    </Box>
                </Paper>
            )}

            {machines && machines.length > 0 && (
                <Paper elevation={3} sx={{ borderRadius: 2, p: { xs: 2, md: 4 } }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                        Compatible Machines
                    </Typography>
                    <List dense>
                        {machines.map((machine, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemIcon>
                                    <Build color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                            {machine.name_equipment}
                                        </Typography>
                                    }
                                    secondary={machine.name_producer}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

export default ProductDetailPage;