"use client"

import {
    Button,
    CssBaseline,
    FormControl,
    Link,
    TextField,
    Typography,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import {useState} from "react";
import {useSnackbar} from "notistack";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {useAuthStore} from "@/features/auth/store";
import AuthCardLayout, {PasswordField} from "@/components/layout/AuthCardLayout";
import {RegisterRequest} from "@/features/auth/types";
import {useRouter} from "next/navigation";

const SignUpSchema = Yup.object().shape({
    fullname: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .matches(/^\+?[0-9]{10,15}$/, "Invalid phone number")
        .required("Phone number is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    agreeToPrivacy: Yup.boolean()
        .oneOf([true], "You must accept the Privacy Policy and Terms of Use")
        .required("You must accept the Privacy Policy and Terms of Use")
});

type SignUpFormValues = Yup.InferType<typeof SignUpSchema>;

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const {register} = useAuthStore();
    const router = useRouter();

    const handleAuthError = (error: any) => {
        const errorMessages = {
            409: "User with this email already exists. Please sign in.",
            500: "Server error. Please try again later.",
        };
        const status = error.status || (error.response?.status);
        const message = errorMessages[status as keyof typeof errorMessages] || error.message || "Unexpected error";

        enqueueSnackbar(message, {variant: "error"});
    };

    const handleSubmit = async (values: SignUpFormValues) => {
        setLoading(true);

        const registerData: RegisterRequest = {
            full_name: values.fullname,
            email: values.email,
            phone: values.phone,
            password: values.password,
        }

        try {
            const success = await register(registerData);

            if (success) {
                enqueueSnackbar("Registration successful", {variant: "success"});
                router.push("/");
            } else {
                enqueueSnackbar("Registration failed", {variant: "error"});
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CssBaseline/>
            <AuthCardLayout title="Sign up" isLogin={false}>
                <Formik
                    initialValues={{
                        fullname: "",
                        email: "",
                        phone: "",
                        password: "",
                        agreeToPrivacy: false
                    }}
                    validationSchema={SignUpSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, handleChange, handleBlur}) => (
                        <Form>
                            <FormControl fullWidth margin="normal">
                                <Field
                                    as={TextField}
                                    label="Fullname"
                                    type="text"
                                    name="fullname"
                                    value={values.fullname}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    helperText={<ErrorMessage name="fullname"/>}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <Field
                                    as={TextField}
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    helperText={<ErrorMessage name="email"/>}
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <Field
                                    as={TextField}
                                    label="Phone Number"
                                    type="tel"
                                    name="phone"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    helperText={<ErrorMessage name="phone"/>}
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

                            <FormControl fullWidth margin="normal">
                                <FormControlLabel
                                    control={
                                        <Field
                                            as={Checkbox}
                                            name="agreeToPrivacy"
                                            id="agreeToPrivacy"
                                            checked={values.agreeToPrivacy}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            I have read and agree to the{" "}
                                            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                                                Privacy Policy
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/terms-of-use" target="_blank" rel="noopener noreferrer">
                                                Terms of Use
                                            </Link>
                                            . I consent to the processing of my personal data for the purposes of communication
                                            and service provision.
                                        </Typography>
                                    }
                                />
                                <ErrorMessage name="agreeToPrivacy">
                                    {(msg) => (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: '32px' }}> {/* Adjust ml as needed */}
                                            {msg}
                                        </Typography>
                                    )}
                                </ErrorMessage>
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? "Loading..." : "Sign up"}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </AuthCardLayout>
        </>
    );
}