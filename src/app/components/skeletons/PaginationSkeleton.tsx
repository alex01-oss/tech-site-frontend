import { Box, Skeleton, Stack } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

const PaginationSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        margin: isMobile ? "20px 0" : "30px 0",
        padding: "0 16px",
      }}
    >
      <Stack direction="row" spacing={isMobile ? 1 : 1.5}>
        <Skeleton
          variant="circular"
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
        />
        <Skeleton
          variant="circular"
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
        />
        <Skeleton
          variant="circular"
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
        />
        <Skeleton
          variant="circular"
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
        />
        <Skeleton
          variant="circular"
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
        />
      </Stack>
    </Box>
  );
};

export default PaginationSkeleton;
