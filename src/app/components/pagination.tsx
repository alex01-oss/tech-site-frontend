import React from "react";
import {
  Pagination as MUIPagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";

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
      sx={{
        display: "flex",
        justifyContent: "center",
        margin: isMobile ? "20px 0" : "30px 0",
        padding: "0 16px",
        "& .MuiPaginationItem-root": {
          color: "inherit",
        },
        ...(isMobile && {
          "& .MuiPaginationItem-root": {
            minWidth: "32px",
            height: "32px",
            margin: "0 2px",
            padding: 0,
            fontSize: "14px",
          },
        }),
      }}
    />
  );
};

export default Pagination;
