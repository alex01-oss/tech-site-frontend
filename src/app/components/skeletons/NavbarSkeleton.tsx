import { Skeleton, AppBar, Toolbar, Box } from "@mui/material";

export default function NavbarSkeleton() {
  return (
    <AppBar
      sx={{
        boxShadow: "none",
        borderBottom: "1px solid rgba(78, 12, 30, 0.2)",
      }}
    >
      <Toolbar
        sx={{ minHeight: 60, display: "flex", justifyContent: "space-between" }}
      >
        <Box
          sx={{
            pr: 6,
            width: 255,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="rectangular" width={125} height={50} />
        </Box>
        <Skeleton variant="circular" width={32} height={32} />
      </Toolbar>
    </AppBar>
  );
}
