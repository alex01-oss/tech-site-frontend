"use client"

import React from 'react';
import {Button, CircularProgress, useTheme} from '@mui/material';
import {Form, Formik, FormikConfig} from 'formik';
import {AuthCardLayout} from "@/components/layout/AuthCardLayout";
import {FormWrapperDict} from "@/types/dict";

interface Props<T> {
    title: string;
    isLogin?: boolean;
    initialValues: FormikConfig<T>['initialValues'];
    validationSchema: FormikConfig<T>['validationSchema'];
    onSubmitAction: FormikConfig<T>['onSubmit'];
    loading: boolean;
    submitText: string;
    children: React.ReactNode;
    dict: FormWrapperDict
}

export const FormWrapper = <T extends object>({
    title,
    isLogin = false,
    initialValues,
    validationSchema,
    onSubmitAction,
    loading,
    submitText,
    children,
    dict
}: Props<T>) => {
    const theme = useTheme();

    return (
        <AuthCardLayout title={title} isLogin={isLogin} dict={dict.authLayout}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmitAction}
            >
                <Form role="form">
                    {children}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{mt: theme.spacing(2), height: theme.spacing(5)}}
                    >
                        {loading
                            ? <CircularProgress size={theme.spacing(3)} aria-label={dict.loadingLabel} />
                            : submitText}
                    </Button>
                </Form>
            </Formik>
        </AuthCardLayout>
    );
};