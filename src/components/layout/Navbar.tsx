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
import {useAuthStore} from "@/features/auth/store";
import {useCartStore} from "@/features/cart/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {LANGS} from "@/lib/i18n";


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

interface Props {
    dict: {
        authRequired: string,
        login: string,
        lightMode: string,
        darkMode: string,
        language: string,
        settings: string,
        cart: string,
        profile: string,
        logo: string,
        goBack: string,
    }
}

export const Navbar: React.FC<Props> = ({dict}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const {mode, toggleColorMode} = useThemeContext();
    const isDark = mode === "dark";
    const {push, replaceLanguage, back, currentLang, pathname} = useNavigatingRouter();
    const {enqueueSnackbar} = useSnackbar();
    const {isAuthenticated, user} = useAuthStore();
    const {cartCount, fetchCartCount, countLoading} = useCartStore();

    const settingsMenu = useMenu();
    const langMenu = useMenu();

    useEffect(() => {
        if (isAuthenticated) void fetchCartCount();
    }, [isAuthenticated, fetchCartCount]);

    const handleLanguageChange = (lang: string) => {
        replaceLanguage(lang);
        settingsMenu.close();
        langMenu.close();
    };

    const handleCartClick = () => {
        if (isAuthenticated) {
            push("/cart");
        } else {
            enqueueSnackbar(dict.authRequired, {
                variant: "error",
                action:
                    <Button
                        color="inherit" size="small" onClick={() => push("/login")}>
                        {dict.login}
                    </Button>
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
                    px: {xs: 2, sm: 3}
                }}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        {pathname === `/${currentLang}` ? (
                            <Box component="a" onClick={() => replaceLanguage(currentLang)} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                cursor: 'pointer'
                            }}>
                                <Image src="/logo_white.svg" alt={dict.logo} width={125} height={50}/>
                            </Box>
                        ) : (
                            <IconButton color="inherit" onClick={() => back()} aria-label={dict.goBack}>
                                <ArrowBackIcon/>
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center"}}>
                        {isMobile ? (
                            <>
                                <Tooltip title={dict.settings}>
                                    <IconButton onClick={settingsMenu.open} color="inherit" aria-label={dict.settings}>
                                        <SettingsIcon/>
                                    </IconButton>
                                </Tooltip>
                                <MenuWithItems {...settingsMenu}>
                                    {Object.keys(LANGS).map((lang: string) => (
                                        <LangMenuItem key={lang} lang={lang as keyof typeof LANGS}
                                                      onClick={handleLanguageChange}/>
                                    ))}
                                    <Divider sx={{my: 0.5}}/>
                                    <MenuItem onClick={() => {
                                        toggleColorMode();
                                        settingsMenu.close();
                                    }}>
                                        <ListItemIcon>{isDark ? <Brightness7/> : <Brightness4/>}</ListItemIcon>
                                        <ListItemText>{isDark ? dict.lightMode : dict.darkMode}</ListItemText>
                                    </MenuItem>
                                </MenuWithItems>
                            </>
                        ) : (
                            <>
                                <Tooltip title={dict.language}>
                                    <IconButton onClick={langMenu.open} color="inherit" aria-label={dict.language}>
                                        <Image src={LANGS[currentLang as keyof typeof LANGS].flag} alt={LANGS[currentLang as keyof typeof LANGS].name}
                                               width={24} height={24}/>
                                    </IconButton>
                                </Tooltip>
                                <MenuWithItems {...langMenu}>
                                    {Object.keys(LANGS).map((lang: string) => (
                                        <LangMenuItem key={lang} lang={lang as keyof typeof LANGS}
                                                      onClick={handleLanguageChange}/>
                                    ))}
                                </MenuWithItems>
                                <Tooltip title={isDark ? dict.lightMode : dict.darkMode}>
                                    <IconButton onClick={toggleColorMode} color="inherit" aria-label={isDark ? dict.lightMode : dict.darkMode}>
                                        {isDark ? <Brightness7/> : <Brightness4/>}
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        <Tooltip title={dict.cart}>
                            <IconButton onClick={handleCartClick} color="inherit" aria-label={dict.cart}>
                                {countLoading ? (
                                    <CircularProgress size={24} color="inherit"/>
                                ) : (
                                    <Badge badgeContent={cartCount} color="primary">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={dict.profile}>
                            <Avatar
                                onClick={() => push(isAuthenticated ? `/profile` : `/login`)}
                                sx={{width: theme.spacing(5), height: theme.spacing(5), cursor: 'pointer', ml: 1}}
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