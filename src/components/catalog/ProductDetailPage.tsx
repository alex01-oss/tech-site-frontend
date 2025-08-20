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

export const ProductDetailPage: React.FC<Props> = ({initialProductData, initialError, dict}) => {
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
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <Typography color="error" variant="h6">{error}</Typography>
                <Button onClick={() => router.back()} sx={{mt: theme.spacing(2)}}>
                    {dict.goBack}
                </Button>
            </Box>
        );
    }

    if (!productData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="text.secondary">Product data not available.</Typography>
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
                gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
            }}
        >
            <Paper elevation={2}
                   sx={{borderRadius: theme.shape.borderRadius, p: {xs: theme.spacing(2), sm: theme.spacing(3)}}}>
                <Grid container spacing={{xs: theme.spacing(2), sm: theme.spacing(3)}}>
                    <Grid item xs={12} md={5}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                                pb: {xs: theme.spacing(2), sm: theme.spacing(0)}
                            }}
                        >
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
                                    py: theme.spacing(1.5),
                                    fontWeight: theme.typography.fontWeightBold,
                                    borderRadius: theme.shape.borderRadius,
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
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: {xs: theme.spacing(2), md: theme.spacing(3)}
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
                                label={`${dict.code} ${item.code}`}
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

                            <Divider sx={{my: theme.spacing(2)}}/>

                            <Box>
                                <Typography variant="h6" sx={{
                                    fontWeight: theme.typography.fontWeightMedium,
                                    mb: theme.spacing(1),
                                    color: 'text.secondary'
                                }}>
                                    {dict.keySpecs}
                                </Typography>
                                <Grid container spacing={theme.spacing(1)}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1"
                                                    sx={{fontWeight: theme.typography.fontWeightMedium}}>
                                            {dict.dimensions} {item.dimensions}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {bonds && bonds.length > 0 && (
                                            <Typography variant="body1"
                                                        sx={{fontWeight: theme.typography.fontWeightMedium}}>
                                                {dict.bond} {bonds.map(bond => bond.name_bond).join(', ')}
                                            </Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1"
                                                    sx={{fontWeight: theme.typography.fontWeightMedium}}>
                                            {dict.gridSize} {item.grid_size}
                                        </Typography>
                                    </Grid>
                                    {mounting && (
                                        <Grid item xs={12}>
                                            <Typography variant="body1"
                                                        sx={{fontWeight: theme.typography.fontWeightMedium}}>
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
                <Paper elevation={2}
                       sx={{borderRadius: theme.shape.borderRadius, p: {xs: theme.spacing(2), md: theme.spacing(4)}}}>
                    <Typography variant="h5" component="h2" sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        mb: theme.spacing(2),
                        color: 'text.primary'
                    }}>
                        {dict.bondDetails}
                    </Typography>
                    {bonds.map((bond, index) => (
                        <Box key={index} sx={{
                            mb: theme.spacing(2),
                            '&:last-child': {mb: theme.spacing(0)}
                        }}>
                            <Typography variant="h6" component="h3"
                                        sx={{
                                            fontWeight: theme.typography.fontWeightMedium,
                                            mb: theme.spacing(1),
                                            color: 'text.primary'
                                        }}>
                                {bond.name_bond}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{mb: theme.spacing(2)}}>
                                {bond.bond_description}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'flex-start', gap: theme.spacing(1)}}>
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
                <Paper elevation={3}
                       sx={{borderRadius: theme.shape.borderRadius, p: {xs: theme.spacing(2), md: theme.spacing(4)}}}>
                    <Typography variant="h5" component="h2" sx={{
                        fontWeight: theme.typography.fontWeightMedium,
                        mb: theme.spacing(2),
                        color: 'text.primary'
                    }}>
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
                                        <Typography variant="body1"
                                                    sx={{fontWeight: theme.typography.fontWeightMedium}}>
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