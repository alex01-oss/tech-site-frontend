import { Box, Paper, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid";

interface ProductSkeletonProps {
  count?: number;
  tileHeight?: string;
}

const ProductSkeleton = ({
  count = 8,
  tileHeight = "68px",
}: ProductSkeletonProps) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Grid container spacing={1.5}>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                elevation={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: "8px",
                  height: tileHeight,
                  border: "1px solid rgba(142, 32, 65, 0.1)",
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{ display: "flex", width: "100%", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      minWidth: { xs: "40px", sm: "50px" },
                      display: "flex",
                      justifyContent: "center",
                      mr: 1,
                    }}
                  >
                    <Skeleton variant="circular" width={30} height={30} />
                  </Box>

                  <Box
                    sx={{
                      flex: "1 1 auto",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      overflow: "hidden",
                    }}
                  >
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="20%" height={24} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default ProductSkeleton;
