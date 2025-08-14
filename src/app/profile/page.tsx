'use client';

import React from 'react';
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
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {useAuthStore} from '@/features/auth/store';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {useCartStore} from "@/features/cart/store";
import {enqueueSnackbar} from "notistack";

export default function ProfilePage() {
    const {user, logout} = useAuthStore();
    const router = useNavigatingRouter();
    const theme = useTheme();

    const {cartCount} = useCartStore();

    const handleLogout = async () => {
        try {
            await logout();
            enqueueSnackbar('You have been logged out successfully.', {variant: 'success'});
            router.push('/');
        } catch (error) {
            enqueueSnackbar('Failed to log out.', {variant: 'error'});
        }
    };

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Typography variant="h6" align="center">Please log in to view your profile.</Typography>
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
        <Paper elevation={3} sx={{p: {xs: 2, sm: 3}, borderRadius: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', mb: {xs: 2, sm: 3}, flexDirection: {xs: 'column', md: 'row'}}}>
                {renderUserAvatar()}
                <Box sx={{ml: {xs: 0, md: 4}, mt: {xs: 2, md: 0}, textAlign: {xs: 'center', md: 'left'}}}>
                    <Typography variant="h4" component="h1" fontWeight="bold">{user.full_name}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">{user.role}</Typography>
                </Box>
                <Box sx={{ml: 'auto', mt: {xs: 2, md: 0}}}>
                    <Button
                        variant="contained"
                        onClick={() => router.push("/profile/edit")}
                        startIcon={<EditIcon/>}
                    >
                        Edit Profile
                    </Button>
                </Box>
            </Box>

            <Divider sx={{my: {xs: 2, sm: 3}}}/>

            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <Typography variant="h6">Contact Information</Typography>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemText primary="Email" secondary={user.email}/>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemText primary="Phone" secondary={user.phone || 'N/A'}/>
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{my: {xs: 2, sm: 3}}}/>

            <Box>
                <Typography variant="h6">Your Activity</Typography>
                <List>
                    <ListItem>
                        <ListItemText primary="Items in Cart" secondary={cartCount}/>
                    </ListItem>
                </List>
            </Box>

            <Divider sx={{my: {xs: 2, sm: 3}}}/>

            <Box>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Paper>
    );
}