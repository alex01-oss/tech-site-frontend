'use client';

import React, {useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from 'formik';
import * as Yup from 'yup';
import {useAuthStore} from '@/features/auth/store';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {enqueueSnackbar} from 'notistack';
import {PasswordField} from "@/components/layout/AuthCardLayout";

interface ProfileFormValues {
    full_name: string;
    email: string;
    phone: string;
    currentPassword: string;
    password: string;
    confirmPassword: string;
}

export default function EditProfilePage() {
    const {user, updateUser, deleteUser, logoutAll} = useAuthStore();
    const router = useNavigatingRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser();
            enqueueSnackbar('Your account has been deleted.', {variant: 'success'});
            router.push('/');
        } catch (error) {
            enqueueSnackbar('Failed to delete account.', {variant: 'error'});
        } finally {
            setIsDeleting(false);
            setOpenDeleteDialog(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        try {
            await logoutAll();
            enqueueSnackbar('Logged out of all other devices.', {variant: 'success'});
        } catch (error) {
            enqueueSnackbar('Failed to log out of all devices.', {variant: 'error'});
        }
    };

    const handleUpdateProfile = async (
        values: ProfileFormValues,
        {setSubmitting, resetForm}: FormikHelpers<ProfileFormValues>
    ) => {
        try {
            const updateData: {
                full_name?: string;
                email?: string;
                phone?: string;
                password?: string;
            } = {};

            if (values.full_name && values.full_name !== user?.full_name) updateData.full_name = values.full_name;
            if (values.email && values.email !== user?.email) updateData.email = values.email;
            if (values.phone && values.phone !== user?.phone) updateData.phone = values.phone;

            if (values.password) updateData.password = values.password

            if (Object.keys(updateData).length === 0) {
                enqueueSnackbar('No changes to save.', {variant: 'info'});
                return;
            }

            const success = await updateUser(updateData);
            if (success) {
                enqueueSnackbar('Profile updated successfully!', {variant: 'success'});
                resetForm({
                    values: {
                        ...values,
                        currentPassword: '',
                        password: '',
                        confirmPassword: ''
                    }
                });
            } else {
                enqueueSnackbar('Failed to update profile.', {variant: 'error'});
            }
        } catch (error) {
            console.error("Update profile error:", error);
            enqueueSnackbar('An unexpected error occurred.', {variant: 'error'});
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{mt: 4}}>
                <Typography variant="h6" align="center">Please log in to edit your profile.</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{mt: 4}}>
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{mb: 4}}>
                Edit Profile
            </Typography>

            <Formik<ProfileFormValues>
                initialValues={{
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone || '',
                    currentPassword: '',
                    password: '',
                    confirmPassword: '',
                }}
                validationSchema={Yup.object({
                    full_name: Yup.string().required('Full name is required'),
                    email: Yup.string().email('Invalid email address').required('Email is required'),
                    phone: Yup.string().matches(/^\+?[0-9()\s-]{7,20}$/, 'Invalid phone number').nullable(),
                    password: Yup.string()
                        .min(6, 'Password must be at least 6 characters long')
                        .notOneOf([Yup.ref('currentPassword')], 'New password cannot be the same as the current password')
                        .nullable(),

                    currentPassword: Yup.string().when('password', {
                        is: (password: any) => !!password,
                        then: (schema) => schema.required('Current password is required'),
                        otherwise: (schema) => schema.notRequired(),
                    }),

                    confirmPassword: Yup.string().when('password', {
                        is: (password: any) => !!password,
                        then: (schema) => schema
                            .oneOf([Yup.ref('password')], 'Passwords must match')
                            .required('Confirm password is required'),
                        otherwise: (schema) => schema.notRequired(),
                    }),
                })}
                onSubmit={handleUpdateProfile}
            >
                {({isSubmitting, handleChange, handleBlur, values}) => (
                    <Form>
                        <Paper elevation={3} sx={{p: {xs: 2, md: 4}, mb: 4}}>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Field as={TextField} name="full_name" label="Full Name" fullWidth margin="normal"
                                   helperText={<ErrorMessage name="full_name"/>}
                            />
                            <Field as={TextField} name="email" label="Email" fullWidth margin="normal"
                                   helperText={<ErrorMessage name="email"/>}
                            />
                            <Field as={TextField} name="phone" label="Phone" fullWidth margin="normal"
                                   helperText={<ErrorMessage name="phone"/>}
                            />
                        </Paper>

                        <Paper elevation={3} sx={{p: {xs: 2, md: 4}, mb: 4}}>
                            <Typography variant="h6" gutterBottom>
                                Change Password
                            </Typography>
                            <PasswordField
                                name="currentPassword"
                                label="Current Password"
                                value={values.currentPassword || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                            <PasswordField
                                name="password"
                                label="New Password"
                                value={values.password || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                            <PasswordField
                                name="confirmPassword"
                                label="Confirm New Password"
                                value={values.confirmPassword || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{mt: 2}}>
                                Update Profile
                            </Button>
                        </Paper>
                    </Form>
                )}
            </Formik>

            <Paper elevation={3} sx={{p: {xs: 2, md: 4}, mb: 4}}>
                <Typography variant="h6" gutterBottom>
                    Account Management
                </Typography>
                <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 2, mt: 2}}>
                    <Button variant="outlined" color="primary" onClick={handleLogoutAllDevices}>
                        Logout Other Devices
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)}>
                        Delete Account
                    </Button>
                </Box>
            </Paper>

            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action is irreversible.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} color="primary" disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" disabled={isDeleting}>
                        {isDeleting ? <CircularProgress size={24}/> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}