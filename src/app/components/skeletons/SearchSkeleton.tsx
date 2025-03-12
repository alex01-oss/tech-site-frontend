import { Box, Skeleton } from "@mui/material";

const SearchSkeleton = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: 56,
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          px: 2,
        }}
      >
        <Skeleton
          variant="circular"
          width={24}
          height={24}
          sx={{ mr: 2, flexShrink: 0 }}
        />
        <Skeleton variant="text" width="80%" height={24} />
      </Box>
    </Box>
  );
};

export default SearchSkeleton;
