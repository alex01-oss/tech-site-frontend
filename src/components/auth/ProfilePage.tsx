"use client"

import {useAuthStore} from "@/features/auth/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {
    Avatar,
    Box,
    Button,
    Container,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    useTheme
} from "@mui/material";
import {useCartStore} from "@/features/cart/store";
import {enqueueSnackbar} from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

interface Props {
    dict: {
        title: string;
        edit: string;
        contactInfo: string;
        activity: string;
        cartItems: string;
        logout: string;
        logoutSuccess: string;
        logoutError: string;
        loginRequired: string;
        email: string;
        phone: string;
    }
}

export const ProfilePage: React.FC<Props> = ({dict}) => {
    const {user, logout} = useAuthStore();
    const router = useNavigatingRouter();
    const theme = useTheme();

    const {cartCount} = useCartStore();

    const handleLogout = async () => {
        try {
            await logout();
            enqueueSnackbar(dict.logoutSuccess, {variant: 'success'});
            router.push('/');
        } catch (error) {
            enqueueSnackbar(dict.logoutError, {variant: 'error'});
        }
    };

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{mt: theme.spacing(4)}}>
                <Typography variant="h6" align="center">{dict.loginRequired}</Typography>
            </Container>
        );
    }

    const renderUserAvatar = () => (
        <Avatar
            sx={{
                width: theme.spacing(12),
                height: theme.spacing(12),
                fontSize: theme.spacing(6),
            }}
        >
            {user.full_name
                ?.split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((word: string) => word[0]?.toUpperCase())
                .join("")}
        </Avatar>
    );

    return (
        <Paper elevation={3}
               sx={{p: {xs: theme.spacing(2), sm: theme.spacing(3)}, borderRadius: theme.shape.borderRadius}}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                mb: {xs: theme.spacing(2), sm: theme.spacing(3)},
                flexDirection: {xs: 'column', md: 'row'}
            }}>
                {renderUserAvatar()}
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
                        {dict.edit}
                    </Button>
                </Box>
            </Box>

            <Divider sx={{my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}/>

            <Box sx={{display: 'flex', flexDirection: 'column', gap: theme.spacing(2)}}>
                <Typography variant="h6">{dict.contactInfo}</Typography>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemText primary={dict.email} secondary={user.email}/>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemText primary={dict.phone} secondary={user.phone || 'N/A'}/>
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}/>

            <Box>
                <Typography variant="h6">{dict.activity}</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary={dict.cartItems} secondary={cartCount}/>
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{my: {xs: theme.spacing(2), sm: theme.spacing(3)}}}/>

            <Box>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                    {dict.logout}
                </Button>
            </Box>
        </Paper>
    );
};