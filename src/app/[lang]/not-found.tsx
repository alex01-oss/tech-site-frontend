import Link from "next/link";
import { Box, Typography } from "@mui/material";

export default function NotFound() {
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
          color: "primary.main",
        }}
      >
        404
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontSize: "1.5rem",
          color: "text.primary",
        }}
      >
        Page Not Found
      </Typography>
      <Link
        href="/"
        style={{
          marginTop: "1rem",
          fontSize: "1.2rem",
          color: "#C74667",
          textDecoration: "underline",
        }}
      >
        Go back home
      </Link>
    </Box>
  );
}
