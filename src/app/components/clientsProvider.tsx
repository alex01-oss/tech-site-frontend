"use client";

import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";
import ThemeProviderWrapper from "../context/context";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
    </SnackbarProvider>
  );
}
