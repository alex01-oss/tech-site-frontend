import { Box, List, ListItem, ListItemButton, Skeleton } from "@mui/material";

const SidebarSkeleton = () => {
  return (
    <Box
      sx={{
        width: 256,
        borderRight: "1px solid rgba(142, 32, 65, 0.1)",
      }}
    >
      <List>
        {Array(1)
          .fill(0)
          .map((_, categoryIndex) => (
            <Box key={categoryIndex}>
              {Array(5)
                .fill(0)
                .map((_, itemIndex) => (
                  <ListItem key={itemIndex} disablePadding>
                    <ListItemButton
                      sx={{
                        borderRadius: "8px",
                        margin: "6px 12px",
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        sx={{ mr: 2 }}
                      />
                      <Skeleton variant="text" width="70%" height={24} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </Box>
          ))}
      </List>
    </Box>
  );
};

export default SidebarSkeleton;
