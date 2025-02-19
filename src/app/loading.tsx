import { CircularProgress, Box } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minHeight: "200px",
      }}
    >
      <CircularProgress sx={{ color: "#950740" }} />
    </Box>
  );
}
