"use client";

import React, {useState} from "react";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
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
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import Image from "next/image";

interface Props {
    initialProductData: ProductDetailData | null;
    initialError: string | null;
    dict: {
        productNotFound: string;
        serverError: string;
        loadError: string;
        loading: string;
        goBack: string;
        unavailable: string;
        code: string;
        keySpecs: string;
        dimensions: string;
        bond: string;
        gridSize: string;
        mounting: string;
        bondDetails: string;
        cooling: string;
        compatibleMachines: string;
        remove: string,
        inCart: string,
        add: string,
        mm: string,
        inch: string,
    }
}

function ProductDetailPage({initialProductData, initialError, dict}: Props) {
    const [productData] = useState<ProductDetailData | null>(initialProductData);
    const [error] = useState<string | null>(initialError);

    const isLoading = productData === null && error === null;

    const router = useNavigatingRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080/api";

    const {handleToggleCart, isInCart} = useToggleCart();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={() => router.back()} sx={{mt: 2}}>{dict.goBack}</Button>
            </Box>
        );
    }

    if (!productData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="textSecondary">Product data not available.</Typography>
            </Box>
        );
    }

    const {item, bonds, machines, mounting} = productData;
    const imageUrl = `${apiUrl}/${item.images}`;
    const inCart = isInCart(item.id);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: {xs: 2, sm: 3},
            }}
        >
            <Paper elevation={2} sx={{borderRadius: 1, p: {xs: 2, sm: 3}}}>
                <Grid container spacing={{xs: 2, sm: 3}}>
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 3,
                                pb: {xs: 2, md: 0}
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: isMobile ? 200 : 300,
                                    maxHeight: 300,
                                    bgcolor: theme.palette.grey[100],
                                    borderRadius: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    border: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={item.shape}
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
                                        ? <Delete/>
                                        : item.is_in_cart
                                            ? <CheckBox/>
                                            : <ShoppingCart/>
                                }
                                sx={{
                                    py: 1.5,
                                    fontWeight: 600,
                                    borderRadius: 1,
                                    textTransform: "none",
                                }}
                            >
                                {inCart
                                    ? dict.remove
                                    : item.is_in_cart
                                        ? dict.inCart
                                        : dict.add
                                }
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: {xs: 2, md: 3}}}>
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
                                label={`${dict.code} ${item.code}`}
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
                                    borderRadius: 1
                                })}
                            />

                            <Divider sx={{my: 2}}/>

                            <Box>
                                <Typography variant="h6" sx={{fontWeight: 600, mb: 1, color: 'text.secondary'}}>
                                    {dict.keySpecs}
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{fontWeight: 500}}>
                                            {dict.dimensions} {item.dimensions}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {bonds && bonds.length > 0 && (
                                            <Typography variant="body1" sx={{fontWeight: 500}}>
                                                {dict.bond} {bonds.map(bond => bond.name_bond).join(', ')}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" sx={{fontWeight: 500}}>
                                            {dict.gridSize} {item.grid_size}
                                        </Typography>
                                    </Grid>
                                    {mounting && (
                                        <Grid item xs={12}>
                                            <Typography variant="body1" sx={{fontWeight: 500}}>
                                                {dict.mounting} {mounting.mm} {dict.mm} / {mounting.inch} {dict.inch}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {bonds && bonds.length > 0 && (
                <Paper elevation={2} sx={{borderRadius: 1, p: {xs: 2, md: 4}}}>
                    <Typography variant="h5" component="h2" sx={{fontWeight: 600, mb: 2, color: 'text.primary'}}>
                        {dict.bondDetails}
                    </Typography>
                    {bonds.map((bond, index) => (
                        <Box key={index} sx={{
                            mb: 2,
                            '&:last-child': {mb: 0}
                        }}>
                            <Typography variant="h6" component="h3"
                                        sx={{fontWeight: 600, mb: 1, color: 'text.primary'}}>
                                {bond.name_bond}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{mb: 2}}>
                                {bond.bond_description}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 1}}>
                                <InfoOutlined color="action"/>
                                <Typography variant="body2" color="text.secondary">
                                    {dict.cooling} {bond.bond_cooling}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Paper>
            )}

            {machines && machines.length > 0 && (
                <Paper elevation={3} sx={{borderRadius: 1, p: {xs: 2, md: 4}}}>
                    <Typography variant="h5" component="h2" sx={{fontWeight: 600, mb: 2, color: 'text.primary'}}>
                        {dict.compatibleMachines}
                    </Typography>
                    <List dense>
                        {machines.map((machine, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemIcon>
                                    <Build color="action"/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{fontWeight: 500}}>
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
}

export default ProductDetailPage;