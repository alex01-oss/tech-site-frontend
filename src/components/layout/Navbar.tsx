"use client";

import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    Toolbar,
    Tooltip,
    useMediaQuery,
    useTheme
} from "@mui/material";
import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useThemeContext} from "@/context/context";
import React, {useEffect} from "react";
import {useSnackbar} from "notistack";
import {usePathname} from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Brightness4, Brightness7} from "@mui/icons-material";
import {useAuthStore} from "@/features/auth/store";
import {useCartStore} from "@/features/cart/store";
import MenuIcon from '@mui/icons-material/Menu';
import {useAdminDrawerStore} from "@/app/admin/store/useAdminDrawerStore";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";

export default function Navbar() {
    const theme = useTheme();
    const {mode, toggleColorMode} = useThemeContext();
    const isDark = mode === "dark";
    const router = useNavigatingRouter();
    const pathname = usePathname();
    const {enqueueSnackbar} = useSnackbar();
    const {isAuthenticated, user} = useAuthStore();
    const {cartCount, fetchCartCount, countLoading} = useCartStore();

    useEffect(() => {
        if (isAuthenticated) void fetchCartCount();
    }, [isAuthenticated, fetchCartCount]);

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const toggleDrawer = useAdminDrawerStore(state => state.toggleDrawer);

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
            <Image src="/logo_white.svg" alt="logo" width={125} height={50}/>
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

    const renderBurgerButton = () => {
        if (pathname === '/admin') {
            return (
                <IconButton onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>
            )
        }
    }

    return (
        <AppBar
            position="fixed"
            elevation={1}
            color="default"
            sx={{
                zIndex: theme => theme.zIndex.drawer + 1,
                height: '64px',
                '--navbar-height': '64px'
            }}
        >
            <Container maxWidth="lg" sx={{ height: '100%' }}>
                <Toolbar
                    sx={{
                        minHeight: '64px !important',
                        height: '100%',
                        display: "flex",
                        justifyContent: "space-between",
                        px: { xs: 2, md: 3 },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {pathname === "/" ? (
                            renderLogo()
                        ) : (
                            <>
                                {renderBackButton()}
                                {pathname === "/admin" && isMobile && renderBurgerButton()}
                            </>
                        )}
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
                                            action: (
                                                <Button
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => router.push("/login")}
                                                >
                                                    Login
                                                </Button>
                                            )
                                        });
                                }}
                                color="inherit"
                            >
                                {countLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    <Badge badgeContent={cartCount} color="primary">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <Avatar
                                onClick={() => isAuthenticated
                                    ? router.push("/profile")
                                    : router.push("/login")
                                }
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
                                        .map((word: string) => word[0]?.toUpperCase())
                                        .join("")
                                    : ""}
                            </Avatar>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}