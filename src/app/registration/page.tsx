"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import GoogleIcon, { FacebookIcon } from "../components/customIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/app/api/service";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SignUp() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);

    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetchData("register", "POST", data);
      localStorage.setItem("accessToken", response.token);

      const userData = { name: data.email };
      localStorage.setItem("user", JSON.stringify(userData));

      router.push("/");
    } catch (error) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <>
      <CssBaseline />
      <Stack height="100vh" minHeight="100%" p={2} justifyContent="center">
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
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <FormControl>
              <TextField
                label="Full name"
                fullWidth
                variant="outlined"
                name="username"
                required
              />
            </FormControl>

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

            <FormControl>
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
            {error && <Typography color="error">{error}</Typography>}
          </Box>
          <Divider>or</Divider>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button fullWidth variant="outlined" startIcon={<GoogleIcon />}>
              Sign up with Google
            </Button>
            <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
              Sign up with Facebook
            </Button>
            <Typography textAlign="center">
              Already have an account?{" "}
              <Link onClick={() => router.push("/login")}>Sign in</Link>
            </Typography>
          </Box>
        </Card>
      </Stack>
    </>
  );
}
