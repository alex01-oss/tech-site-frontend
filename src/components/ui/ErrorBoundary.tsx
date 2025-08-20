"use client";

import {Box, Button, Typography, useTheme} from "@mui/material";
import React from "react";

interface Props {
    children: React.ReactNode;
    dict: {
        errorTitle: string;
        reloadButton: string;
    };
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(_: Error) {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error:", error);
        console.error("Error Info:", errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const theme = useTheme();

            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        textAlign: "center",
                        padding: { xs: 2, md: 4 },
                        bgcolor: "background.default",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mb: theme.spacing(2),
                            color: "primary.main"
                        }}
                    >
                        {this.props.dict.errorTitle}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => window.location.reload()}
                        color="primary"
                    >
                        {this.props.dict.reloadButton}
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
