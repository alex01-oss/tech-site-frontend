"use client";

import {
    AppBar,
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
import {NavbarDict, ToolbarDict} from "@/types/dict";
import {UserAvatar} from "@/components/ui/UserAvatar";


const useMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    return {
        anchorEl,
        isOpen: Boolean(anchorEl),
        open: (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget),
        close: () => setAnchorEl(null)
    };
};

const MenuWithItems = ({anchorEl, isOpen, close, children, id}: any) => (
    <Menu
        id={id}
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

const LangMenuItem = ({lang, onClick, isSelected}: { lang: keyof typeof LANGS, onClick: (l: string) => void, isSelected: boolean }) => (
    <MenuItem onClick={() => onClick(lang)} selected={isSelected}>
        <ListItemIcon>
            <Image src={LANGS[lang].flag} alt={LANGS[lang].name} width={24} height={24} style={{borderRadius: '4px'}}/>
        </ListItemIcon>
        <ListItemText>{LANGS[lang].name}</ListItemText>
    </MenuItem>
);

export const Navbar: React.FC<{ dict: ToolbarDict }> = ({dict}) => {
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {mode, toggleColorMode} = useThemeContext();
    const isDark = mode === "dark";
    const {push, replaceLanguage, back, currentLang, pathname} = useNavigatingRouter();
    const {isAuthenticated, user} = useAuthStore();
    const {cartCount, fetchCartCount, countLoading} = useCartStore();

    const settingsMenu = useMenu();
    const langMenu = useMenu();

    useEffect(() => {
        if (isAuthenticated) void fetchCartCount();
    }, [isAuthenticated]);

    const handleLanguageChange = (lang: string) => {
        replaceLanguage(lang);
        settingsMenu.close();
        langMenu.close();
    };

    const handleCartClick = () => {
        if (isAuthenticated) push("/cart");
        else {
            enqueueSnackbar(dict.navbar.authRequired, {
                variant: "error",
                action: (
                    <Button color="inherit" size="small" onClick={() => push("/login")}>
                        {dict.navbar.login}
                    </Button>
                ),
            });
        }
    };

    return (
        <AppBar position="fixed" elevation={1}>
            <Container maxWidth="lg" sx={{height: "100%"}} disableGutters>
                <Toolbar
                    sx={{
                        minHeight: "64px",
                        height: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        px: {xs: 2, sm: 3},
                    }}
                    role="navigation"
                >
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        {pathname === `/${currentLang}` ? (
                            <Box
                                component="a"
                                href="/"
                                aria-label={dict.navbar.logo}
                                onClick={() => replaceLanguage(currentLang)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                            >
                                <Image
                                    src={isDark ? "/logo_white.svg" : "/logo_gray.svg"}
                                    alt={dict.navbar.logo}
                                    width={125}
                                    height={50}
                                />
                            </Box>
                        ) : (
                            <IconButton color="inherit" onClick={() => back()} aria-label={dict.navbar.goBack}>
                                <ArrowBackIcon/>
                            </IconButton>
                        )}
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center"}}>
                        {isMobile ? (
                            <>
                                <Tooltip title={dict.navbar.settings}>
                                    <IconButton
                                        onClick={settingsMenu.open}
                                        color="inherit"
                                        aria-label={dict.navbar.settings}
                                        aria-haspopup="menu"
                                        aria-controls="settings-menu"
                                        aria-expanded={settingsMenu.isOpen}
                                    >
                                        <SettingsIcon/>
                                    </IconButton>
                                </Tooltip>
                                <MenuWithItems {...settingsMenu} id="settings-menu">
                                    {Object.keys(LANGS).map((lang: string) => (
                                        <LangMenuItem
                                            key={lang}
                                            lang={lang as keyof typeof LANGS}
                                            onClick={handleLanguageChange}
                                            isSelected={lang === currentLang}
                                        />
                                    ))}
                                    <Divider sx={{my: 0.5}}/>
                                    <MenuItem
                                        onClick={() => {
                                            toggleColorMode();
                                            settingsMenu.close();
                                        }}
                                    >
                                        <ListItemIcon>
                                            {isDark ? <Brightness7/> : <Brightness4/>}
                                        </ListItemIcon>
                                        <ListItemText>
                                            {isDark ? dict.navbar.lightMode : dict.navbar.darkMode}
                                        </ListItemText>
                                    </MenuItem>
                                </MenuWithItems>
                            </>
                        ) : (
                            <>
                                <Tooltip title={dict.navbar.language}>
                                    <IconButton
                                        onClick={langMenu.open}
                                        color="inherit"
                                        aria-label={dict.navbar.language}
                                        aria-haspopup="menu"
                                        aria-controls="lang-menu"
                                        aria-expanded={langMenu.isOpen}
                                    >
                                        <Image
                                            src={LANGS[currentLang as keyof typeof LANGS].flag}
                                            alt={LANGS[currentLang as keyof typeof LANGS].name}
                                            width={24}
                                            height={24}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <MenuWithItems {...langMenu} id="lang-menu">
                                    {Object.keys(LANGS).map((lang: string) => (
                                        <LangMenuItem
                                            key={lang}
                                            lang={lang as keyof typeof LANGS}
                                            onClick={handleLanguageChange}
                                            isSelected={lang === currentLang}
                                        />
                                    ))}
                                </MenuWithItems>
                                <Tooltip title={isDark ? dict.navbar.lightMode : dict.navbar.darkMode}>
                                    <IconButton
                                        onClick={toggleColorMode}
                                        color="inherit"
                                        aria-label={isDark ? dict.navbar.lightMode : dict.navbar.darkMode}
                                    >
                                        {isDark ? <Brightness7/> : <Brightness4/>}
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}

                        <Tooltip title={dict.navbar.cart}>
                            <IconButton onClick={handleCartClick} color="inherit" aria-label={`${dict.navbar.cart}. ${dict.navbar.cartCount} ${cartCount}`}>
                                {countLoading ? (
                                    <CircularProgress size={24} color="inherit" aria-label={dict.navbar.loading} />
                                ) : (
                                    <Badge badgeContent={cartCount} color="primary">
                                        <ShoppingCartIcon/>
                                    </Badge>
                                )}
                            </IconButton>
                        </Tooltip>

                        <Tooltip title={dict.navbar.profile}>
                            <UserAvatar
                                user={user}
                                isAuthenticated={isAuthenticated}
                                size="small"
                                onClick={() => push(isAuthenticated ? `/profile` : `/login`)}
                                dict={dict.avatar}
                            />
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};