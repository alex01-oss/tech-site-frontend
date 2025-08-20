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

interface Props {
    dict: {
        login: {
            title: string,
            signInButton: string,
            loading: string,
            emailLabel: string,
            passwordLabel: string,
            success: string,
            invalidCredentials: string,
            error: string,
            validation: {
                emailRequired: string,
                emailInvalid: string,
                passwordRequired: string
            },
        },
        authLayout: any
    }
}

export const SignIn: React.FC<Props> = ({dict}) => {
    const {loading, startLoading, stopLoading, handleSuccess, handleError} = useFormHandler();
    const {login} = useAuthStore();
    const router = useNavigatingRouter();

    const handleSubmit = async (values: any) => {
        startLoading();
        const loginData: LoginRequest = {
            email: values.email,
            password: values.password
        };
        try {
            const success = await login(loginData);
            if (success) {
                handleSuccess(dict.login.success);
                router.push("/");
            } else {
                handleError(dict.login.invalidCredentials);
            }
        } catch (error: any) {
            handleError(dict.login.error, error);
        } finally {
            stopLoading();
        }
    };

    return (
        <FormWrapper
            title={dict.login.title}
            isLogin={true}
            loading={loading}
            submitText={loading ? dict.login.loading : dict.login.signInButton}
            initialValues={{email: "", password: ""}}
            validationSchema={getSignInSchema(dict.login)}
            onSubmitAction={handleSubmit}
            dict={dict.authLayout}
        >
            <FormControl fullWidth margin="normal">
                <Field
                    as={TextField}
                    type="email"
                    label={dict.login.emailLabel}
                    name="email"
                    required
                    helperText={<ErrorMessage name="email"/>}
                />
            </FormControl>
            <PasswordField
                name="password"
                label={dict.login.passwordLabel}
                required
            />
            <ErrorMessage name="password"/>
        </FormWrapper>
    );
}