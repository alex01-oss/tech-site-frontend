"use client";

import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Container,
    IconButton,
    Toolbar,
    Tooltip,
    useTheme
} from "@mui/material";
import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useThemeContext} from "@/context/context";
import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {usePathname, useRouter} from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Brightness4, Brightness7} from "@mui/icons-material";
import {useAuthStore} from "@/features/auth/store";
import {useCartStore} from "@/features/cart/store";
import AccountMenu from "@/components/common/AccountMenu";

export default function Navbar() {
    const theme = useTheme();
    const {mode, toggleColorMode} = useThemeContext();
    const isDark = mode === "dark";
    const router = useRouter();
    const pathname = usePathname();
    const {enqueueSnackbar} = useSnackbar();
    const {isAuthenticated, user} = useAuthStore();
    const {cartCount, fetchCart} = useCartStore();

    useEffect(() => {
        if (isAuthenticated) void fetchCart();
    }, [isAuthenticated, fetchCart]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose = () => setAnchorEl(null);

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const renderLogo = () => (
        <Box
            component="a"
            onClick={() => router.push("/")}
            sx={{
                pr: {xs: 0, md: 6},
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                cursor: 'pointer',
            }}
        >
            <Image src="/logo_white.svg" alt="logo" width={125} height={50} />
        </Box>
    );

    const renderBackButton = () => (
        <IconButton
            color="inherit"
            onClick={() => router.back()}
        >
            <ArrowBackIcon/>
        </IconButton>
    );

    return (
        <AppBar position="fixed" elevation={1} color="default">
            <Container maxWidth="lg">
                <Toolbar
                    sx={{
                        minHeight: theme.mixins.toolbar.minHeight,
                        display: "flex",
                        justifyContent: "space-between",
                        px: {xs: 2, md: 3},
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {pathname === "/" ? renderLogo() : renderBackButton()}
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", gap: {xs: 1, md: 1}}}>
                        <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                            <IconButton onClick={toggleColorMode} color="inherit">
                                {isDark ? <Brightness7/> : <Brightness4/>}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Shopping Cart">
                            <IconButton
                                onClick={() => {
                                    isAuthenticated
                                        ? router.push("/cart")
                                        : enqueueSnackbar("You must be authorized", {
                                            variant: "error",
                                        });
                                }}
                                color="inherit"
                            >
                                <Badge badgeContent={cartCount} color="primary">
                                    <ShoppingCartIcon/>
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <Avatar
                                onClick={handleProfileClick}
                                sx={{
                                    width: theme.spacing(5),
                                    height: theme.spacing(5),
                                    ml: {xs: 0, md: 1},
                                    cursor: 'pointer',
                                }}
                            >
                                {isAuthenticated && user?.full_name?.trim()
                                    ? user.full_name
                                        .split(" ")
                                        .filter(Boolean)
                                        .slice(0, 2)
                                        .map((word: string[]) => word[0]?.toUpperCase())
                                        .join("")
                                    : ""}
                            </Avatar>
                        </Tooltip>

                        <AccountMenu anchorEl={anchorEl} handleCloseAction={handleClose}/>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}