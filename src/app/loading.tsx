import { CircularProgress, Box } from "@mui/material";
import styles from "./styles/loading.module.css";

export default function Loading() {
  return (
    <Box className={styles.loadingContainer}>
      <CircularProgress sx={{ color: "#950740" }} />
    </Box>
  );
}
