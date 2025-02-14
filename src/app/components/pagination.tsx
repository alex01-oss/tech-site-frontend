import React from "react";
import { Pagination as MUIPagination } from "@mui/material";
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
  const pagesCount = Math.ceil(items / pageSize);

  if (pagesCount <= 1) return null;

  return (
    <MUIPagination
      count={pagesCount}
      page={currentPage}
      onChange={(_, page) => onPageChange(page)}
      color="standard"
      size="large"
      showFirstButton
      showLastButton
      className={styles.paginationContainer}
      sx={{
        "& .MuiPaginationItem-root": {
          className: styles.paginationItem,
        },
      }}
    />
  );
};

export default Pagination;
