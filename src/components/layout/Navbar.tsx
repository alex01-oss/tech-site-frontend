"use client";

import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {Brightness4, Brightness7, Settings as SettingsIcon} from "@mui/icons-material";
import {useThemeContext} from "@/contexts/context";
import React, {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import {usePathname} from "next/navigation";
import {useAuthStore} from "@/features/auth/store";
import {useCartStore} from "@/features/cart/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";

const LANGS = {
    uk: {flag: "/ua_flag.svg", name: "Українська"},
    en: {flag: "/uk_flag.svg", name: "English"}
};

const useMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    return {
        anchorEl,
        isOpen: Boolean(anchorEl),
        open: (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget),
        close: () => setAnchorEl(null)
    };
};

const MenuWithItems = ({anchorEl, isOpen, close, children}: any) => (
    <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={close}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        sx={{mt: 1.5}}
    >
        {children}
    </Menu>
);

const LangMenuItem = ({lang, onClick}: { lang: keyof typeof LANGS, onClick: (l: string) => void }) => (
    <MenuItem onClick={() => onClick(lang)}>
        <ListItemIcon>
            <Image src={LANGS[lang].flag} alt={LANGS[lang].name} width={24} height={24} style={{borderRadius: '4px'}}/>
        </ListItemIcon>
        <ListItemText>{LANGS[lang].name}</ListItemText>
    </MenuItem>
);

export default function Navbar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {mode, toggleColorMode} = useThemeContext();
    const isDark = mode === "dark";
    const router = useNavigatingRouter();
    const pathname = usePathname();
    const {enqueueSnackbar} = useSnackbar();
    const {isAuthenticated, user} = useAuthStore();
    const {cartCount, fetchCartCount, countLoading} = useCartStore();

    const settingsMenu = useMenu();
    const langMenu = useMenu();
    const [currentLanguage, setCurrentLanguage] = useState<keyof typeof LANGS>('uk');

    useEffect(() => {
        if (isAuthenticated) void fetchCartCount();
    }, [isAuthenticated, fetchCartCount]);

    const handleLanguageChange = (lang: string) => {
        setCurrentLanguage(lang as keyof typeof LANGS);
        console.log(`Language switched to: ${lang}`);
        settingsMenu.close();
        langMenu.close();
    };

    const handleCartClick = () => {
        if (isAuthenticated) {
            router.push("/cart");
        } else {
            enqueueSnackbar("You must be authorized", {
                variant: "error",
                action: <Button color="inherit" size="small" onClick={() => router.push("/login")}>Login</Button>
            });
        }
    };

    return (
        <AppBar position="fixed" elevation={1} color="default">
            <Container maxWidth="lg" sx={{height: '100%'}} disableGutters>
                <Toolbar sx={{
                    minHeight: '64px',
                    height: '100%',
                    display: "flex",
                    justifyContent: "space-between",
                    px: {xs: 2, md: 3}
                }}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        {pathname === "/" ? (
                            <Box component="a" onClick={() => router.push("/")} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                cursor: 'pointer'
                            }}>
                                <Image src="/logo_white.svg" alt="logo" width={125} height={50}/>
                            </Box>
                        ) : (
                            <IconButton color="inherit" onClick={() => router.back()}>
                                <ArrowBackIcon/>
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center"}}>
                        {isMobile ? (
                            <>
                                <Tooltip title="Settings">
                                    <IconButton onClick={settingsMenu.open} color="inherit">
                                        <SettingsIcon/>
                                    </IconButton>
                                </Tooltip>
                                <MenuWithItems {...settingsMenu}>
                                    <LangMenuItem lang="uk" onClick={handleLanguageChange}/>
                                    <LangMenuItem lang="en" onClick={handleLanguageChange}/>
                                    <Divider sx={{my: 0.5}}/>
                                    <MenuItem onClick={() => {
                                        toggleColorMode();
                                        settingsMenu.close();
                                    }}>
                                        <ListItemIcon>{isDark ? <Brightness7/> : <Brightness4/>}</ListItemIcon>
                                        <ListItemText>{isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}</ListItemText>
                                    </MenuItem>
                                </MenuWithItems>
                            </>
                        ) : (
                            <>
                                <Tooltip title="Language">
                                    <IconButton onClick={langMenu.open} color="inherit">
                                        <Image src={LANGS[currentLanguage].flag} alt="Language" width={24} height={24}/>
                                    </IconButton>
                                </Tooltip>
                                <MenuWithItems {...langMenu}>
                                    <LangMenuItem lang="uk" onClick={handleLanguageChange}/>
                                    <LangMenuItem lang="en" onClick={handleLanguageChange}/>
                                </MenuWithItems>
                                <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                                    <IconButton onClick={toggleColorMode} color="inherit">
                                        {isDark ? <Brightness7/> : <Brightness4/>}
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        <Tooltip title="Shopping Cart">
                            <IconButton onClick={handleCartClick} color="inherit">
                                {countLoading ? (
                                    <CircularProgress size={24} color="inherit"/>
                                ) : (
                                    <Badge badgeContent={cartCount} color="primary">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Profile">
                            <Avatar
                                onClick={() => router.push(isAuthenticated ? "/profile" : "/login")}
                                sx={{width: theme.spacing(5), height: theme.spacing(5), cursor: 'pointer', ml: 1}}
                            >
                                {isAuthenticated && user?.full_name?.trim()
                                    ? user.full_name.split(" ").filter(Boolean).slice(0, 2).map((word: string) => word[0]?.toUpperCase()).join("")
                                    : ""}
                            </Avatar>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}