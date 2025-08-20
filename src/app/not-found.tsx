import {Box, Link, Typography} from "@mui/material";

export default async function NotFound() {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                bgcolor: "background.default",
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontSize: "4rem",
                    fontWeight: "bold",
                }}
            >
                404
            </Typography>
            <Typography
                variant="body1"
                sx={{fontSize: "1.5rem",}}
            >
                Page Not Found
            </Typography>
            <Link
                href="/"
                sx={{
                    mt: "1rem",
                    fontSize: "1.2rem",
                    color: "#000",
                    textDecoration: "underline",
                }}
            >
                Go back home
            </Link>
        </Box>
    );
}