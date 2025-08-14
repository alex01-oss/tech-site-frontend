// components/SignIn.tsx
'use client';
import React, {useState} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import {Button, CssBaseline, FormControl, TextField} from '@mui/material';
import {useSnackbar} from 'notistack';
import {useAuthStore} from '@/features/auth/store';
import {useNavigatingRouter} from '@/hooks/useNavigatingRouter';
import {useAuthErrors} from '@/hooks/useAuthErrors';
import {LoginRequest} from '@/features/auth/types';
import AuthCardLayout, {PasswordField} from "@/components/layout/AuthCardLayout";

const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

type SignInFormValues = Yup.InferType<typeof SignInSchema>;

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useNavigatingRouter();
    const { login } = useAuthStore();
    const { handleAuthError } = useAuthErrors();

    const handleSubmit = async (values: SignInFormValues) => {
        setLoading(true);
        const loginData: LoginRequest = {
            email: values.email,
            password: values.password
        }
        try {
            const success = await login(loginData);
            if (success) {
                enqueueSnackbar("Login successful!", { variant: "success" });
                router.push("/");
            } else {
                enqueueSnackbar("Invalid credentials", { variant: "error" });
            }
        } catch (error: any) {
            console.error("Login error:", error);
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <CssBaseline />
            <AuthCardLayout title="Sign in" loading={loading} isLogin={true}>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={SignInSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange, handleBlur }) => (
                        <Form>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    as={TextField}
                                    type="email"
                                    label="Email"
                                    fullWidth
                                    variant="outlined"
                                    name="email"
                                    required
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    helperText={<ErrorMessage name="email" />}
                                />
                            </FormControl>
                            <PasswordField
                                name="password"
                                label="Password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                required
                            />
                            <ErrorMessage name="password" />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 2, height: 40 }}
                            >
                                {loading ? "Loading..." : "Sign in"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </AuthCardLayout>
        </>
    );
}