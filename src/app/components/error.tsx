"use client";

import { Box, Typography, Button } from "@mui/material";
import React from "react";
import styles from "../styles/error.module.css";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className={styles.container}>
          <Typography variant="h4" className={styles.title}>
            Something went wrong
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            className={styles.button}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
