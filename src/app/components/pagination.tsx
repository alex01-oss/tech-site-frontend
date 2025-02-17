import React from "react";
import {
  Pagination as MUIPagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import styles from "../styles/pagination.module.css";

interface PaginationProps {
  items: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  items,
  pageSize,
  currentPage,
  onPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pagesCount = Math.ceil(items / pageSize);

  if (pagesCount <= 1) return null;

  return (
    <MUIPagination
      count={pagesCount}
      page={currentPage}
      onChange={(_, page) => onPageChange(page)}
      color="standard"
      size={isMobile ? "medium" : "large"}
      showFirstButton={!isMobile}
      showLastButton={!isMobile}
      siblingCount={isMobile ? 0 : 1}
      boundaryCount={isMobile ? 1 : 2}
      className={`${styles.paginationContainer} ${
        isMobile ? styles.paginationMobile : ""
      }`}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "inherit",
        },
      }}
    />
  );
};

export default Pagination;
