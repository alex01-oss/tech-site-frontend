"use client"

import {Button, CssBaseline, FormControl, TextField} from "@mui/material";
import {useState} from "react";
import {useSnackbar} from "notistack";
import {useRouter} from "next/navigation";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useAuthStore} from "@/features/auth/store";
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
    const router = useRouter();
    const { login } = useAuthStore();

    const handleAuthError = (error: any) => {
        const errorMessages = {
            400: "Required fields are missing",
            401: "Invalid email or password",
            404: "User not found, please register",
            500: "Server error. Please try again later",
        };

        const status = error.status || (error.response?.status);
        const message =
            errorMessages[status as keyof typeof errorMessages] ||
            error.message ||
            "Unexpected error";

        enqueueSnackbar(message, { variant: "error" });
    };

    const handleSubmit = async (values: SignInFormValues) => {
        setLoading(true);
        try {
            const success = await login(values.email, values.password);
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