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
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "4rem", fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "1.5rem" }}>
        Page Not Found
      </Typography>
      <Link
        href="/"
        style={{
          marginTop: "1rem",
          fontSize: "1.2rem",
          color: "#ff4081",
          textDecoration: "underline",
        }}
      >
        Go back home
      </Link>
    </Box>
  );
}
