"use client";

import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormControl,
  Link,
  TextField,
  Typography,
  Stack,
  Card,
  IconButton,
  InputAdornment,
} from "@mui/material";
import GoogleIcon, { FacebookIcon } from "../components/customIcon";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import { useTheme } from "@mui/material/styles";
import { fetchData } from "@/app/api/service";
import { useStore } from "../store/useStore";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as React from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const theme = useTheme();

  const handleOAuthLogin = async (provider: any, accessToken: any) => {
    setLoading(true);

    try {
      const userData = await fetchOAuthUserData(provider, accessToken);

      const response = await fetchData("login", "POST", {
        ...userData,
        password: "oauth-user",
      });

      const { login } = useStore.getState();
      login(
        { username: userData.username, email: userData.email },
        response.token,
        response.refreshToken
      );

      enqueueSnackbar("Login successful!", { variant: "success" });
      router.push("/");
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      enqueueSnackbar(error.message || `${provider} login failed`, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const credentials = {
      email: String(formData.get("email")),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const response = await fetchData("login", "POST", credentials);

      const { login } = useStore.getState();
      login(
        { email: credentials.email },
        response.token,
        response.refreshToken
      );

      enqueueSnackbar("Login successful!", { variant: "success" });
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOAuthUserData = async (provider: any, accessToken: any) => {
    const providerConfig = {
      google: {
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        headers: { Authorization: `Bearer ${accessToken}` },
      },
      facebook: {
        url: `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`,
        headers: {},
      },
    };

    const providerKey = provider as "google" | "facebook";
    const { url, headers } = providerConfig[providerKey];

    try {
      const res = await fetch(url, { headers });
      const data = await res.json();

      if (!data.email || !data.name) {
        throw new Error(
          `${provider} did not provide required user information`
        );
      }

      return { username: data.name, email: data.email };
    } catch (error) {
      console.error(`${provider} data fetch error:`, error);
      throw new Error(`Failed to get user data from ${provider}`);
    }
  };

  const handleAuthError = (error: any) => {
    const errorMessages = {
      400: "Required fields are missing",
      401: "Invalid email or password",
      404: "User not found, please register",
      500: "Server error. Please try again later",
    };

    const status = error.response?.status;
    const message =
      errorMessages[status as keyof typeof errorMessages] ||
      error.message ||
      "Unexpected error";

    enqueueSnackbar(message, { variant: "error" });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) =>
      handleOAuthLogin("google", tokenResponse.access_token),
    flow: "implicit",
  });

  const facebookLogin = (facebookData: any) => {
    if (!facebookData?.accessToken) {
      enqueueSnackbar("Facebook login failed", { variant: "error" });
      return;
    }
    handleOAuthLogin("facebook", facebookData.accessToken);
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
          <Typography
            component="h1"
            variant="h4"
            textAlign="center"
            fontWeight={600}
          >
            Sign in
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <FormControl>
              <TextField
                type="email"
                label="Email"
                fullWidth
                variant="outlined"
                name="email"
                required
              />
            </FormControl>

            <TextField
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              fullWidth
              variant="outlined"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in"}
            </Button>
          </Box>

          <Divider>or</Divider>

          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => googleLogin()}
              disabled={loading}
            >
              Sign in with Google
            </Button>

            <FacebookLogin
              appId="614205724757167"
              scope="public_profile,email"
              onSuccess={facebookLogin}
              render={({ onClick }) => (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={onClick}
                  disabled={loading}
                >
                  Sign in with Facebook
                </Button>
              )}
            />

            <Typography textAlign="center">
              Don't have an account?{" "}
              <Link onClick={() => router.push("/registration")}>Sign up</Link>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
