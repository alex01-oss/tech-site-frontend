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
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useState } from "react";
import * as React from "react";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState("");
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetchData("login", "POST", data);
      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("user", JSON.stringify({ name: data.email }));

      enqueueSnackbar("Login successful!", { variant: "success" });
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || "Login failed";

        switch (status) {
          case 400:
            enqueueSnackbar("Invalid email or password", { variant: "error" });
            break;
          case 404:
            enqueueSnackbar("User not found", { variant: "error" });
            break;
          case 500:
            enqueueSnackbar("Server error. Try again later.", {
              variant: "error",
            });
            break;
          default:
            enqueueSnackbar(message, { variant: "error" });
        }
      } else if (error.request) {
        enqueueSnackbar("No response from server. Check your connection.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(error.message || "An unexpected error occurred", {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOAuthUserData = async (
    provider: "google" | "facebook",
    accessToken: string
  ) => {
    const urls = {
      google: "https://www.googleapis.com/oauth2/v3/userinfo",
      facebook: `https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`,
    };

    try {
      const res = await fetch(urls[provider], {
        headers:
          provider === "google"
            ? { Authorization: `Bearer ${accessToken}` }
            : undefined,
      });

      const data = await res.json();
      if (!data.email || !data.name)
        throw new Error("OAuth did not provide enough info");

      return { username: data.name, email: data.email };
    } catch (error) {
      console.error(`${provider} login error:`, error);
      throw new Error(`${provider} login failed`);
    }
  };

  const handleOAuthLogin = async (
    provider: "google" | "facebook",
    accessToken: string
  ) => {
    setLoading(true);
    try {
      const userData = await fetchOAuthUserData(provider, accessToken);
      const response = await fetchData("login", "POST", {
        ...userData,
        password: "oauth-user",
      });

      localStorage.setItem("accessToken", response.token);
      localStorage.setItem("user", JSON.stringify({ name: userData.email }));

      enqueueSnackbar("Login successful!", { variant: "success" });
      router.push("/");
    } catch (error: any) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setLoading(false);
    }
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

            {error && <Typography color="error">{error}</Typography>}
          </Box>

          <Divider>or</Divider>

          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => googleLogin()}
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
