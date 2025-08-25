"use client"

import {useAuthStore} from "@/features/auth/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {Box, Button, Divider, List, ListItem, ListItemText, Paper, Typography, useTheme} from "@mui/material";
import {useCartStore} from "@/features/cart/store";
import {enqueueSnackbar} from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";
import {UserAvatar} from "@/components/ui/UserAvatar";
import {useDictionary} from "@/providers/DictionaryProvider";

export const ProfilePage = () => {
    const router = useNavigatingRouter();
    const {user, logout, isAuthenticated} = useAuthStore();
    const dict = useDictionary();
    const {cartCount} = useCartStore();
    const theme = useTheme();

    const handleLogout = async () => {
        try {
            await logout();
            enqueueSnackbar(dict.profile.logoutSuccess, {variant: 'success'});
            router.push('/');
        } catch (error) {
            enqueueSnackbar(dict.profile.logoutError, {variant: 'error'});
        }
    };

    if (!user) return <Typography variant="h6" align="center">{dict.profile.loginRequired}</Typography>

    return (
        <Paper elevation={3}
               sx={{p: {xs: theme.spacing(2), sm: theme.spacing(3)}, borderRadius: theme.shape.borderRadius}}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: {xs: theme.spacing(2), sm: theme.spacing(3)},
                flexDirection: {xs: 'column', md: 'row'}
            }}>
                <UserAvatar
                    user={user}
                    isAuthenticated={isAuthenticated}
                    size="large"
                />
                <Box sx={{
                    ml: {xs: 0, md: theme.spacing(4)},
                    mt: {xs: theme.spacing(2), md: 0},
                    textAlign: {xs: 'center', md: 'left'}
                }}>
                    <Typography variant="h4" component="h1"
                                fontWeight={theme.typography.fontWeightBold}>{user.full_name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{user.role}</Typography>
                </Box>
                <Box sx={{ml: 'auto', mt: {xs: theme.spacing(2), md: 0}}}>
                    <Button
                        variant="contained"
                        onClick={() => router.push("/profile/edit")}
                        startIcon={<EditIcon/>}
                    >
                        {dict.profile.edit.title}
                    </Button>
                </Box>
            </Box>

            <Divider sx={{my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}/>

            <Box sx={{display: 'flex', flexDirection: 'column', gap: theme.spacing(2)}}>
                <Typography variant="h6" component="h2">{dict.profile.contactInfo}</Typography>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemText primary={dict.profile.email} secondary={user.email}/>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemText primary={dict.profile.phone} secondary={user.phone || 'N/A'}/>
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}/>

            <Box>
                <Typography variant="h6" component="h2">{dict.profile.activity}</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={dict.profile.cartItems} secondary={cartCount}/>
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}/>

            <Box>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                    {dict.profile.logout}
                </Button>
            </Box>
        </Paper>
    );
};