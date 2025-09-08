"use client"

import React from "react";
import {useNavigatingRouter} from "@/hooks/useNavigatingRouter";
import {useAuthStore} from "@/features/auth/store";
import {LoginRequest} from "@/features/auth/types";
import {FormControl, TextField} from "@mui/material";
import {ErrorMessage, Field} from "formik";
import {FormWrapper} from "@/components/auth/FormWrapper";
import {getSignInSchema} from "@/utils/validationSchemas";
import {useFormHandler} from "@/hooks/useFormHandler";
import {PasswordField} from "@/components/auth/PasswordField";
import {useDictionary} from "@/providers/DictionaryProvider";
import { FormikFieldProps } from "@/types/formik";

export const SignIn = () => {
    const {loading, startLoading, stopLoading, handleSuccess, handleError} = useFormHandler();
    const {login} = useAuthStore();
    const router = useNavigatingRouter();
    const dict = useDictionary();

    const handleSubmit = async (values: any) => {
        startLoading();
        const loginData: LoginRequest = {
            email: values.email,
            password: values.password
        };
        try {
            const success = await login(loginData);
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
            title={dict.auth.login.title}
            isLogin={true}
            loading={loading}
            submitText={loading ? dict.common.loading : dict.auth.login.button}
            initialValues={{email: "", password: ""}}
            validationSchema={getSignInSchema(dict)}
            onSubmitAction={handleSubmit}
        >
            <FormControl fullWidth margin="normal">
                <Field name="email">
                    {({ field, meta }: FormikFieldProps) => (
                        <TextField
                        {...field}
                        type="email"
                        label={dict.auth.login.email}
                        id="login-email-input"
                        required
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? meta.error : ''}
                        fullWidth
                        margin="normal"
                        />
                    )}
                    </Field>
            </FormControl>
            <PasswordField
                name="password"
                label={dict.auth.login.password}
                required
            />
        </FormWrapper>
    );
}