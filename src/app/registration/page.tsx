"use client";

import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Link,
  CssBaseline,
} from "@mui/material";
import GoogleIcon, { FacebookIcon } from "../components/customIcon";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useGoogleLogin } from "@react-oauth/google";
import { useTheme } from "@mui/material/styles";
import { useStore } from "../store/useStore";
import { useRouter } from "next/navigation";
import { fetchData } from "../api/service";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import * as Yup from "yup";

const providerConfig = {
  google: "https://www.googleapis.com/oauth2/v3/userinfo",
  facebook: "https://graph.facebook.com/me?fields=name,email",
} as const;

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { login, fetchCart } = useStore();
  const router = useRouter();
  const theme = useTheme();

  const handleAuth = async (
    endpoint: "register" | "login",
    userData: { username: string; email: string; password?: string }
  ) => {
    setLoading(true);
    try {
      const response = await fetchData(endpoint, "POST", userData);
      await fetchCart();
      login(response.user, response.token, response.refreshToken);
      enqueueSnackbar(
        `${endpoint === "register" ? "Registration" : "Login"} successful`,
        { variant: "success" }
      );
      router.push("/");
    } catch (error: any) {
      if (error.status === 409 && endpoint === "register") {
        enqueueSnackbar("User already exists. Logging in...", {
          variant: "warning",
        });
        return handleAuth("login", {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        });
      }
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOAuthUserData = async (
    provider: "google" | "facebook",
    accessToken: string
  ) => {
    try {
      const res = await fetch(providerConfig[provider], {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      return data.email && data.name
        ? { username: data.name, email: data.email }
        : null;
    } catch {
      return null;
    }
  };

  const handleOAuthRegister = async (
    provider: "google" | "facebook",
    response: any
  ) => {
    const token = response.access_token || response.accessToken;
    if (!token)
      return enqueueSnackbar(`${provider} login failed`, { variant: "error" });

    const userData = await fetchOAuthUserData(provider, token);
    if (!userData)
      return enqueueSnackbar(`Failed to retrieve ${provider} user data`, {
        variant: "error",
      });

    handleAuth("register", { ...userData, password: "oauth-user" });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => handleOAuthRegister("google", res),
    flow: "implicit",
  });

  const handleAuthError = (error: any) => {
    enqueueSnackbar(error.message || "Unexpected error", { variant: "error" });
  };

  return (
    <>
      <CssBaseline />
      <Stack height="100vh" p={2} justifyContent="center">
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "center",
            maxWidth: 450,
            p: 4,
            gap: 2,
            m: "auto",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="h4" textAlign="center" fontWeight={600}>
            Sign up
          </Typography>
          <Formik
            initialValues={{ username: "", email: "", password: "" }}
            validationSchema={SignUpSchema}
            onSubmit={(values) => handleAuth("register", values)}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form>
                <FormControl fullWidth margin="normal">
                  <Field
                    as={TextField}
                    label="Username"
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    helperText={<ErrorMessage name="username" />}
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
                    helperText={<ErrorMessage name="email" />}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Field
                    as={TextField}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    helperText={<ErrorMessage name="password" />}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign up"}
                </Button>

                <Divider>or</Divider>

                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => googleLogin()}
                  >
                    Sign up with Google
                  </Button>
                  <FacebookLogin
                    appId="614205724757167"
                    scope="public_profile,email"
                    onSuccess={(res) => handleOAuthRegister("facebook", res)}
                    render={({ onClick }) => (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FacebookIcon />}
                        onClick={onClick}
                      >
                        Sign up with Facebook
                      </Button>
                    )}
                  />
                  <Typography textAlign="center">
                    Already have an account?{" "}
                    <Link onClick={() => router.push("/login")}>Sign in</Link>
                  </Typography>
                </Box>
              </Form>
            )}
          </Formik>
        </Card>
      </Stack>
    </>
  );
}
