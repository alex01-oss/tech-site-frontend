"use client";

import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";
import ThemeProviderWrapper from "../context/context";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="173029689005-nnbq1m264cqvke820ik5jn0gio5pbd6d.apps.googleusercontent.com">
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
      </SnackbarProvider>
    </GoogleOAuthProvider>
  );
}
