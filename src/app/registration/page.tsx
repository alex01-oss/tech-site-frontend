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

  const handleRegistration = async (userData: {
    username: string;
    email: string;
    password?: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetchData("register", "POST", userData);
      console.log(response);
      await fetchCart();

      const user = {
        email: userData.email,
        username: userData.username,
      };

      login(user, response.token, response.refreshToken);

      enqueueSnackbar("Registration successful", { variant: "success" });
      router.push("/");
    } catch (error: any) {
      console.error("Registration error:", error);

      if (error.status === 409) {
        enqueueSnackbar("User already exists. Logging in...", {
          variant: "warning",
        });

        try {
          const response = await fetchData("login", "POST", {
            email: userData.email,
            password: userData.password,
          });

          const user = {
            id: response.userId,
            email: userData.email,
            username: userData.username,
          };

          login(user, response.token, response.refreshToken);
          await fetchCart();

          enqueueSnackbar("Logged in successfully", { variant: "success" });
          router.push("/");
        } catch (loginError) {
          enqueueSnackbar("User exists but login failed. Try manually.", {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar(error.message || "An unexpected error occurred", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOAuthUserData = async (url: any, accessToken: any) => {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();

      if (!data.email || !data.name) throw new Error("Missing user info");

      return { username: data.name, email: data.email };
    } catch (error) {
      console.error("OAuth error:", error);
      return null;
    }
  };

  const handleGoogleRegister = async (response: any) => {
    if (!response.access_token)
      return enqueueSnackbar("Google login failed", { variant: "error" });

    const userData = await fetchOAuthUserData(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      response.access_token
    );

    if (!userData)
      return enqueueSnackbar("Failed to retrieve Google user data", {
        variant: "error",
      });

    handleRegistration({ ...userData, password: "oauth-user" });
  };

  const handleFacebookRegister = async (response: any) => {
    if (!response.accessToken)
      return enqueueSnackbar("Facebook login failed", { variant: "error" });

    const userData = await fetchOAuthUserData(
      `https://graph.facebook.com/me?fields=name,email`,
      response.accessToken
    );

    if (!userData)
      return enqueueSnackbar("Failed to retrieve Facebook user data", {
        variant: "error",
      });

    handleRegistration({ ...userData, password: "oauth-user" });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleRegister,
    flow: "implicit",
  });

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
            width: "100%",
            maxWidth: 450,
            p: 4,
            gap: 2,
            m: "auto",
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            textAlign="center"
            fontWeight={600}
          >
            Sign up
          </Typography>
          <Formik
            initialValues={{
              username: "",
              email: "",
              password: "",
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleRegistration}
          >
            {({ values, handleChange, handleBlur }) => (
              <Form>
                <FormControl fullWidth margin="normal">
                  <Field
                    as={TextField}
                    label="Full name"
                    variant="outlined"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!values.username && !values.username.trim()}
                    helperText={<ErrorMessage name="username" />}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Field
                    as={TextField}
                    type="email"
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!values.email && !values.email.trim()}
                    helperText={<ErrorMessage name="email" />}
                  />
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <Field
                    as={TextField}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    variant="outlined"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    error={!!values.password && !values.password.trim()}
                    helperText={<ErrorMessage name="password" />}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
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
                    onSuccess={handleFacebookRegister}
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
