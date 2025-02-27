import { Skeleton, Box, Container } from "@mui/material";

export default function FooterSkeleton() {
  return (
    <Box sx={{ padding: "16px", borderTop: "1px solid rgba(78, 12, 30, 0.2)" }}>
      <Container maxWidth="xl" sx={{ textAlign: "center" }}>
        <Skeleton
          variant="rectangular"
          width={150}
          height={60}
          sx={{ margin: "0 auto" }}
        />
        <Skeleton
          variant="text"
          width={200}
          height={20}
          sx={{ margin: "8px auto" }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="circular" width={32} height={32} />
          ))}
        </Box>
        <Skeleton
          variant="text"
          width={300}
          height={16}
          sx={{ margin: "8px auto" }}
        />
      </Container>
    </Box>
  );
}
