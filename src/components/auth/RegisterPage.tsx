'use client';

import React from 'react';
import {ErrorMessage, Field} from 'formik';
import {Checkbox, FormControl, FormControlLabel, Link, TextField, Typography, useTheme} from '@mui/material';
import {useAuthStore} from '@/features/auth/store';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {RegisterRequest} from '@/features/auth/types';
import {useFormHandler} from "@/hooks/useFormHandler";
import {FormWrapper} from "@/components/auth/FormWrapper";
import {getSignUpSchema} from "@/utils/validationSchemas";
import {PasswordField} from "@/components/auth/PasswordField";
import {useDictionary} from "@/providers/DictionaryProvider";

export const SignUp = () => {
    const {loading, startLoading, stopLoading, handleSuccess, handleError} = useFormHandler();
    const {register} = useAuthStore();
    const router = useNavigatingRouter();
    const dict = useDictionary();
    const theme = useTheme();

    const handleSubmit = async (values: any) => {
        startLoading();
        const registerData: RegisterRequest = {
            full_name: values.fullname,
            email: values.email,
            phone: values.phone,
            password: values.password,
        };
        try {
            const success = await register(registerData);
            if (success) {
                handleSuccess(dict.auth.message.success);
                router.push("/");
            }
        } catch (error: any) {
            handleError(dict.auth.message.error, error);
        } finally {
            stopLoading();
        }
    };

    return (
        <FormWrapper
            title={dict.auth.register.title}
            isLogin={false}
            loading={loading}
            submitText={loading ? dict.common.loading : dict.auth.register.button}
            initialValues={{fullname: "", email: "", phone: "", password: "", agreeToPrivacy: false}}
            validationSchema={getSignUpSchema(dict)}
            onSubmitAction={handleSubmit}
        >
            <FormControl fullWidth margin="normal">
                <Field
                    as={TextField}
                    label={dict.auth.register.fullName}
                    type="text"
                    name="fullname"
                    id="signup-fullname-input"
                    required
                    helperText={<ErrorMessage name="fullname"/>}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <Field
                    as={TextField}
                    label={dict.auth.register.email}
                    type="email"
                    name="email"
                    id="signup-email-input"
                    required
                    helperText={<ErrorMessage name="email"/>}
                />
            </FormControl>
            <FormControl fullWidth margin="normal">
                <Field
                    as={TextField}
                    label={dict.auth.register.phone}
                    type="tel"
                    name="phone"
                    id="signup-phone-input"
                    required
                    helperText={<ErrorMessage name="phone"/>}
                />
            </FormControl>
            <PasswordField
                name="password"
                label={dict.auth.register.password}
                required
            />
            <FormControl fullWidth margin="normal">
                <FormControlLabel
                    control={<Field as={Checkbox} name="agreeToPrivacy" id="agreeToPrivacy"/>}
                    label={
                        <Typography variant="body2">
                            {dict.auth.register.privacyText}
                            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer"
                                  sx={{ml: theme.spacing(0.5)}}>
                                {dict.common.privacyPolicy}
                            </Link>
                            {" "}
                            {dict.common.and}
                            {" "}
                            <Link href="/terms-of-use" target="_blank" rel="noopener noreferrer">
                                {dict.common.termsOfUse}
                            </Link>
                            .
                        </Typography>
                    }
                />
                <ErrorMessage name="agreeToPrivacy">
                    {(msg) => (
                        <Typography variant="caption" color="error"
                                    sx={{mt: theme.spacing(0.5), ml: theme.spacing(4)}}>
                            {msg}
                        </Typography>
                    )}
                </ErrorMessage>
            </FormControl>
        </FormWrapper>
    );
}