"use client";

import React, {useState} from "react";
import {
    Box,
    Button,
    Chip,
    Divider,
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
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import Image from "next/image";
import Spinner from "@/components/ui/Spinner";
import {API_URL} from "@/constants/constants";
import {useDictionary} from "@/providers/DictionaryProvider";

interface Props {
    initialProductData: ProductDetailData | null;
    initialError: string | null;
}

export const ProductDetailPage: React.FC<Props> = ({ initialProductData, initialError }) => {
    const [productData] = useState<ProductDetailData | null>(initialProductData);
    const [error] = useState<string | null>(initialError);
    const theme = useTheme();
    const { handleToggleCart, isInCart } = useToggleCart();
    const router = useNavigatingRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const dict = useDictionary()

    const isLoading = productData === null && error === null;

    if (isLoading) return <Spinner aria-label={dict.catalog.loadingProducts} />;

    if (error) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Typography color="error" variant="h6" role="alert">{error}</Typography>
                <Button onClick={() => router.back()} sx={{ mt: theme.spacing(2) }}>
                    {dict.common.back}
                </Button>
            </Box>
        );
    }

    if (!productData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="text.secondary" role="status">Product data not available.</Typography>
            </Box>
        );
    }

    const { item, bonds, machines, mounting } = productData;
    const imageUrl = `${API_URL}/${item.images}`;
    const inCart = isInCart(item.id);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: theme.spacing(2), sm: theme.spacing(3) },
            }}
        >
            <Paper elevation={2}
                   sx={{ borderRadius: theme.shape.borderRadius, p: { xs: theme.spacing(2), sm: theme.spacing(3)} }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: theme.spacing(2), sm: theme.spacing(3) },
                }}>
                    <Box sx={{
                        flex: '1 1 50%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: { xs: theme.spacing(2), sm: theme.spacing(3) },
                        pb: { xs: theme.spacing(2), sm: theme.spacing(0) }
                    }}>
                        <Box
                            sx={{
                                width: '100%',
                                height: isMobile ? 200 : 300,
                                maxHeight: 300,
                                bgcolor: theme.palette.background.paper,
                                borderRadius: theme.shape.borderRadius,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                            }}
                        >
                            <Image
                                src={imageUrl}
                                alt={dict.catalog.product.imageAlt.replace('{productShape}', item.shape)}
                                height={300}
                                width={300}
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
                            onClick={() => handleToggleCart(item.id)}
                            startIcon={
                                inCart
                                    ? <Delete />
                                    : item.is_in_cart
                                        ? <CheckBox />
                                        : <ShoppingCart />
                            }
                            sx={{
                                py: theme.spacing(1.5),
                                fontWeight: theme.typography.fontWeightBold,
                                borderRadius: theme.shape.borderRadius,
                                textTransform: "none",
                            }}
                            aria-label={
                                inCart
                                    ? dict.common.remove
                                    : item.is_in_cart
                                        ? dict.catalog.product.inCart
                                        : dict.common.add
                            }
                        >
                            {inCart
                                ? dict.common.remove
                                : item.is_in_cart
                                    ? dict.catalog.product.inCart
                                    : dict.common.add
                            }
                        </Button>
                    </Box>

                    <Box sx={{
                        flex: '1 1 50%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: { xs: theme.spacing(2), md: theme.spacing(3) }
                    }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: theme.typography.fontWeightBold,
                                color: "text.primary",
                                lineHeight: 1.2,
                                mb: theme.spacing(1)
                            }}
                        >
                            {item.shape}
                        </Typography>
                        <Chip
                            label={`${dict.catalog.product.code} ${item.code}`}
                            size="medium"
                            sx={(theme) => ({
                                bgcolor: theme.palette.primary.light,
                                color: theme.palette.primary.contrastText,
                                fontWeight: theme.typography.fontWeightBold,
                                fontSize: "1rem",
                                py: theme.spacing(1),
                                px: theme.spacing(1.5),
                                height: 'auto',
                                alignSelf: 'flex-start',
                                borderRadius: theme.shape.borderRadius
                            })}
                        />

                        <Divider sx={{ my: theme.spacing(2) }} />

                        <Box>
                            <Typography variant="h6" component="h2" sx={{
                                fontWeight: theme.typography.fontWeightMedium,
                                mb: theme.spacing(1),
                                color: 'text.secondary'
                            }}>
                                {dict.catalog.product.keySpecs}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: theme.spacing(1) }}>
                                <Typography variant="body1"
                                            sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                                    {dict.catalog.product.dimensions} {item.dimensions}
                                </Typography>
                                {bonds && bonds.length > 0 && (
                                    <Typography variant="body1"
                                                sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                                        {dict.catalog.product.bond} {bonds.map(bond => bond.name_bond).join(', ')}
                                    </Typography>
                                )}
                                <Typography variant="body1"
                                            sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                                    {dict.catalog.product.gridSize} {item.grid_size}
                                </Typography>
                                {mounting && (
                                    <Typography variant="body1"
                                                sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                                        {dict.catalog.product.mounting} {mounting.mm} {dict.common.mm} / {mounting.inch} {dict.common.inch}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {bonds && bonds.length > 0 && (
                <Paper elevation={2}
                       sx={{ borderRadius: theme.shape.borderRadius, p: { xs: theme.spacing(2), md: theme.spacing(4) } }}>
                    <Typography variant="h5" component="h2" sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        mb: theme.spacing(2),
                        color: 'text.primary'
                    }}>
                        {dict.catalog.product.bondDetails}
                    </Typography>
                    {bonds.map((bond, index) => (
                        <Box key={index} sx={{
                            mb: theme.spacing(2),
                            '&:last-child': { mb: theme.spacing(0) }
                        }}>
                            <Typography variant="h6" component="h3"
                                        sx={{
                                            fontWeight: theme.typography.fontWeightMedium,
                                            mb: theme.spacing(1),
                                            color: 'text.primary'
                                        }}>
                                {bond.name_bond}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: theme.spacing(2) }}>
                                {bond.bond_description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1) }}>
                                <InfoOutlined color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    {dict.catalog.product.cooling} {bond.bond_cooling}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Paper>
            )}

            {machines && machines.length > 0 && (
                <Paper elevation={3}
                       sx={{ borderRadius: theme.shape.borderRadius, p: { xs: theme.spacing(2), md: theme.spacing(4) } }}>
                    <Typography variant="h5" component="h2" sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        mb: theme.spacing(2),
                        color: 'text.primary'
                    }}>
                        {dict.catalog.product.compatibleMachines}
                    </Typography>
                    <List dense>
                        {machines.map((machine, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemIcon>
                                    <Build color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1"
                                                    sx={{ fontWeight: theme.typography.fontWeightMedium }}>
                                            {machine.model}
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
};