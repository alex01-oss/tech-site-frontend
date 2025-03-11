"use client";

import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
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
import { Formik, Field, Form, ErrorMessage } from "formik";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { fetchData } from "../api/service";
import { useSnackbar } from "notistack";
import Image from "next/image";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetchData("register", "POST", values);
      localStorage.setItem("accessToken", response.token);

      const userData = { name: values.email };
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/");
    } catch (error) {
      setLoading(false);
      alert("Registration failed. Try again.");
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = (response: any) => {
    if (response?.credential) {
      console.log("Google Login successful: ", response.credential);
      enqueueSnackbar("Google login successful", { variant: "success" });
    } else {
      enqueueSnackbar("Login failed", { variant: "error" });
    }
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
            width: "100%",
            maxWidth: 450,
            p: 4,
            gap: 2,
            m: "auto",
            boxShadow: theme.shadows[3],
          }}
        >
          <Image
            src={isDark ? "/logo_red_light.svg" : "/logo_red.svg"}
            alt="logo"
            width={125}
            height={50}
          />
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
            onSubmit={handleSubmit}
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
                  <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() =>
                      enqueueSnackbar("Login failed", { variant: "error" })
                    }
                  />

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                  >
                    Sign up with Google
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                  >
                    Sign up with Facebook
                  </Button>
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
