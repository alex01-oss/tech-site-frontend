"use client"

import {useAuthStore} from "@/features/auth/store";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {useSnackbar} from "notistack";
import {useFormHandler} from "@/hooks/useFormHandler";
import React, {useState} from "react";
import {ErrorMessage, Field, Form, Formik, FormikHelpers} from "formik";
import {UpdateUserRequest} from "@/features/auth/types";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {getProfileSchema} from "@/utils/validationSchemas";
import {PasswordField} from "@/components/auth/PasswordField";
import {ProfileFormValues} from "@/types/formValues";
import {EditProfilePageDict} from "@/types/dict";


export const EditProfilePage: React.FC<{ dict: EditProfilePageDict }> = ({dict}) => {
    const {user, updateUser, deleteUser, logoutAll} = useAuthStore();
    const router = useNavigatingRouter();
    const theme = useTheme();
    const {enqueueSnackbar} = useSnackbar();
    const {startLoading, stopLoading, handleSuccess, handleError} = useFormHandler();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteUser();
            handleSuccess(dict.accountDeleted);
            router.push('/');
        } catch (error) {
            handleError(dict.deleteAccountFailed, error);
        } finally {
            setIsDeleting(false);
            setOpenDeleteDialog(false);
        }
    };

    const handleLogoutAllDevices = async () => {
        try {
            await logoutAll();
            handleSuccess(dict.logoutAllSuccess);
        } catch (error) {
            handleError(dict.logoutAllFailed, error);
        }
    };

    const handleUpdateProfile = async (
        values: ProfileFormValues,
        {setSubmitting, resetForm}: FormikHelpers<ProfileFormValues>
    ) => {
        startLoading();
        try {
            const updateData: UpdateUserRequest = {};
            if (values.full_name && values.full_name !== user?.full_name) updateData.full_name = values.full_name;
            if (values.email && values.email !== user?.email) updateData.email = values.email;
            if (values.phone && values.phone !== user?.phone) updateData.phone = values.phone;
            if (values.password) updateData.password = values.password;
            if (Object.keys(updateData).length === 0) {
                enqueueSnackbar(dict.noChanges, {variant: 'info'});
                return;
            }
            const success = await updateUser(updateData);
            if (success) {
                handleSuccess(dict.success);
                resetForm({
                    values: {...values, currentPassword: '', password: '', confirmPassword: ''}
                });
            } else {
                handleError(dict.updateError);
            }
        } catch (error) {
            handleError(dict.unexpectedError, error);
        } finally {
            stopLoading();
            setSubmitting(false);
        }
    };

    if (!user) return <Typography variant="h6" align="center">{dict.loginRequired}</Typography>

    return (
        <Box>
            <Typography variant="h4" component="h1" fontWeight={theme.typography.fontWeightBold}
                        sx={{mb: {xs: theme.spacing(2), sm: theme.spacing(3)}}}>
                {dict.title}
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
                validationSchema={getProfileSchema(dict)}
                onSubmit={handleUpdateProfile}
            >
                {({isSubmitting}) => (
                    <Form>
                        <Paper elevation={3} sx={{
                            p: {xs: theme.spacing(2), sm: theme.spacing(3)},
                            mb: {xs: theme.spacing(2), sm: theme.spacing(3)},
                            borderRadius: theme.shape.borderRadius
                        }}>
                            <Typography variant="h6" gutterBottom>{dict.personalInfoTitle}</Typography>
                            <Field
                                as={TextField}
                                name="full_name"
                                label={dict.fullNameLabel}
                                fullWidth
                                margin="normal"
                                helperText={<ErrorMessage name="full_name"/>}
                            />
                            <Field
                                as={TextField}
                                name="email"
                                label={dict.emailLabel}
                                fullWidth
                                margin="normal"
                                helperText={<ErrorMessage name="email"/>}
                            />
                            <Field
                                as={TextField}
                                name="phone"
                                label={dict.phoneLabel}
                                fullWidth
                                margin="normal"
                                helperText={<ErrorMessage name="phone"/>}
                            />
                        </Paper>
                        <Paper elevation={3} sx={{
                            p: {xs: theme.spacing(2), sm: theme.spacing(3)},
                            mb: {xs: theme.spacing(2), sm: theme.spacing(3)},
                            borderRadius: theme.shape.borderRadius
                        }}>
                            <Typography variant="h6" gutterBottom>{dict.changePasswordTitle}</Typography>
                            <PasswordField
                                name="currentPassword"
                                label={dict.currentPasswordLabel}
                                required
                            />
                            <PasswordField
                                name="password"
                                label={dict.newPasswordLabel}
                                required
                            />
                            <PasswordField
                                name="confirmPassword"
                                label={dict.confirmNewPasswordLabel}
                                required
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{mt: theme.spacing(2)}}
                            >
                                {dict.updateProfileButton}
                            </Button>
                        </Paper>
                        <Paper elevation={3} sx={{
                            p: {xs: theme.spacing(2), sm: theme.spacing(3)},
                            borderRadius: theme.shape.borderRadius
                        }}>
                            <Typography variant="h6" gutterBottom>{dict.accountManagementTitle}</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: {xs: 'column', md: 'row'},
                                gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
                                mt: {xs: theme.spacing(2), sm: theme.spacing(3)}
                            }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleLogoutAllDevices}
                                >
                                    {dict.logoutAllDevicesButton}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setOpenDeleteDialog(true)}
                                >
                                    {dict.deleteAccountButton}
                                </Button>
                            </Box>
                        </Paper>
                        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}
                                sx={{'& .MuiDialog-paper': {borderRadius: theme.shape.borderRadius}}}>
                            <DialogTitle>{dict.confirmDeletionTitle}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>{dict.confirmDeletionText}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpenDeleteDialog(false)} color="primary"
                                        disabled={isDeleting}>{dict.cancelButton}</Button>
                                <Button
                                    onClick={handleConfirmDelete}
                                    color="error"
                                    variant="contained"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? <CircularProgress size={theme.spacing(3)}/> : dict.deleteButton}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}