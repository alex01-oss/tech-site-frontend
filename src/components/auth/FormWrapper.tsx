import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Formik, Form, FormikConfig } from 'formik';
import {AuthCardLayout} from "@/components/layout/AuthCardLayout";

interface Props<T> {
    title: string;
    isLogin?: boolean;
    initialValues: FormikConfig<T>['initialValues'];
    validationSchema: FormikConfig<T>['validationSchema'];
    onSubmit: FormikConfig<T>['onSubmit'];
    loading: boolean;
    submitText: string;
    children: React.ReactNode;
    dict: any
}

export const FormWrapper = <T extends object>({
    title,
    isLogin = false,
    initialValues,
    validationSchema,
    onSubmit,
    loading,
    submitText,
    children,
    dict
}: Props<T>) => {
    return (
        <AuthCardLayout title={title} isLogin={isLogin} dict={dict}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                <Form>
                    {children}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 2, height: 40 }}
                    >
                        {loading ? <CircularProgress size={24} /> : submitText}
                    </Button>
                </Form>
            </Formik>
        </AuthCardLayout>
    );
};