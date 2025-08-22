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
import {EditProfilePageDict} from "@/types/dict";
import {ProfileFormValues} from "@/types/formValues";


export const EditProfilePage: React.FC<{ dict: EditProfilePageDict }> = ({ dict }) => {
    const { user, updateUser, deleteUser, logoutAll } = useAuthStore();
    const router = useNavigatingRouter();
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { startLoading, stopLoading, handleSuccess, handleError } = useFormHandler();
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
        { setSubmitting, resetForm }: FormikHelpers<ProfileFormValues>
    ) => {
        startLoading();
        try {
            const updateData: UpdateUserRequest = {};

            const fields = ['full_name', 'email', 'phone'] as const;
            fields.forEach(field => {
                if (values[field] && values[field] !== user?.[field]) {
                    updateData[field] = values[field];
                }
            });

            if (values.password) {
                updateData.password = values.password;
                updateData.currentPassword = values.currentPassword;
            }

            if (Object.keys(updateData).length === 0) {
                enqueueSnackbar(dict.noChanges, { variant: 'info' });
                return;
            }

            const success = await updateUser(updateData);
            if (success) {
                handleSuccess(dict.success);
                resetForm({
                    values: { ...values, currentPassword: '', password: '', confirmPassword: '' }
                });
                router.push('/profile');
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

    if (!user) return <Typography variant="h6" align="center">{dict.loginRequired}</Typography>;

    const paperSx = {
        p: { xs: theme.spacing(2), sm: theme.spacing(3) },
        mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
        borderRadius: theme.shape.borderRadius,
        elevation: 3
    };

    const personalFields = [
        { name: 'full_name', label: dict.fullNameLabel, id: 'full-name-input' },
        { name: 'email', label: dict.emailLabel, id: 'email-input' },
        { name: 'phone', label: dict.phoneLabel, id: 'phone-input' }
    ];

    const passwordFields = [
        { name: 'currentPassword', label: dict.currentPasswordLabel },
        { name: 'password', label: dict.newPasswordLabel },
        { name: 'confirmPassword', label: dict.confirmNewPasswordLabel }
    ];

    return (
        <Box>
            <Typography
                variant="h4"
                component="h1"
                fontWeight={theme.typography.fontWeightBold}
                sx={{ mb: { xs: theme.spacing(2), sm: theme.spacing(3) } }}
            >
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
                {({ isSubmitting }) => (
                    <Form>
                        <Paper sx={paperSx}>
                            <Typography variant="h6" component="h2" gutterBottom>{dict.personalInfoTitle}</Typography>
                            {personalFields.map(({ name, label, id }) => (
                                <Field
                                    key={name}
                                    as={TextField}
                                    name={name}
                                    label={label}
                                    id={id}
                                    fullWidth
                                    margin="normal"
                                    helperText={<ErrorMessage name={name} />}
                                />
                            ))}
                        </Paper>

                        <Paper sx={paperSx}>
                            <Typography variant="h6" component="h2" gutterBottom>{dict.changePasswordTitle}</Typography>
                            {passwordFields.map(({ name, label }) => (
                                <PasswordField key={name} name={name} label={label} />
                            ))}
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                sx={{ mt: theme.spacing(2) }}
                            >
                                {isSubmitting
                                    ? <CircularProgress size={24} aria-label={dict.submittingLabel}/>
                                    : dict.updateProfileButton}
                            </Button>
                        </Paper>

                        <Paper sx={{ ...paperSx, mb: 0 }}>
                            <Typography variant="h6" component="h2" gutterBottom>{dict.accountManagementTitle}</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: theme.spacing(2), sm: theme.spacing(3) },
                                mt: { xs: theme.spacing(2), sm: theme.spacing(3) }
                            }}>
                                <Button variant="outlined" color="primary" onClick={handleLogoutAllDevices}>
                                    {dict.logoutAllDevicesButton}
                                </Button>
                                <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(true)}>
                                    {dict.deleteAccountButton}
                                </Button>
                            </Box>
                        </Paper>

                        <Dialog
                            open={openDeleteDialog}
                            onClose={() => setOpenDeleteDialog(false)}
                            sx={{ '& .MuiDialog-paper': { borderRadius: theme.shape.borderRadius } }}
                            aria-labelledby="delete-dialog-title"
                            aria-describedby="delete-dialog-description"
                        >
                            <DialogTitle id="delete-dialog-title">{dict.confirmDeletionTitle}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="delete-dialog-description">{dict.confirmDeletionText}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => setOpenDeleteDialog(false)}
                                    color="primary"
                                    disabled={isDeleting}
                                >
                                    {dict.cancelButton}
                                </Button>
                                <Button
                                    onClick={handleConfirmDelete}
                                    color="error"
                                    variant="contained"
                                    disabled={isDeleting}
                                >
                                    {isDeleting
                                        ? <CircularProgress size={theme.spacing(3)} aria-label={dict.deletingProcessLabel}/>
                                        : dict.deleteButton}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};