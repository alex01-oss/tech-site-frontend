"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import Search from "./components/search";
import { Pagination } from "./components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import styles from "./styles/page.module.css";
import { fetchProductsData } from "./api/service";
import Loading from "./loading";
import CustomImage from "./components/image";
import Image from "next/image";
import { Divide as Hamburger } from "hamburger-react";

interface Product {
  Name: string;
  Price: number;
  Currency: string;
  Images: string;
}

interface Products {
  items: Product[];
  total_items: number;
  total_pages: number;
  current_page: number;
  items_per_page: number;
}

export default function Home() {
  const [products, setProducts] = useState<Products>({
    items: [],
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    items_per_page: 6,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [placeholder, setPlaceholder] = useState("Search...");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuClick = (
    newPlaceholder: string,
    category: string,
    newSearchType: string
  ) => {
    setPlaceholder(newPlaceholder);
    setSearchType(newSearchType);
    setSearchQuery("");
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setOpen(!isMobile);
    setLoading(true);
    fetchProductsData(currentPage, searchQuery, searchType)
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products data: ", error))
      .finally(() => setLoading(false));
  }, [currentPage, searchQuery]);

  const columnConfig: { field: keyof Product; show: true; order: number }[] = [
    { field: "Images", show: true, order: 1 },
    { field: "Name", show: true, order: 2 },
    { field: "Price", show: true, order: 3 },
    { field: "Currency", show: true, order: 4 },
  ];

  const sortedColumns = columnConfig
    .filter((column) => column.show)
    .sort((a, b) => a.order - b.order);

  const handleSearch = (
    query: string,
    category: string,
    searchType: string
  ) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSearchType(searchType);
  };

  return (
    <Box className={styles.container}>
      <AppBar className={styles.navbar}>
        <Toolbar className={styles.toolbar}>
          {isMobile ? (
            <Hamburger toggled={isOpen} toggle={setOpen} />
          ) : (
            <Box component="a" href="https://pdt.tools/">
              <Image src="/logo_white.svg" alt="logo" width={125} height={50} />
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && isOpen && (
        <div
          className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
          onClick={() => setOpen(false)}
        />
      )}

      <div className={isOpen ? "overlay open" : "overlay"}></div>

      <Box className={`${styles.sidebarSlide} ${isOpen ? styles.open : ""}`}>
        <Sidebar
          onMenuClick={(newPlaceholder, category, newSearchType) => {
            handleMenuClick(newPlaceholder, category, newSearchType);
            setOpen(false);
          }}
        />
      </Box>

      <Box className={styles.sidebarContainer}>
        <Box className={styles.header}>
          <Search
            placeholder={placeholder}
            onSearch={handleSearch}
            category={searchType}
            searchType={searchType}
          />
        </Box>

        <Box className={styles.content}>
          {loading ? (
            <Loading />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                {/* <TableHead>
                <TableRow>
                  {sortedColumns.map((column, index) => (
                    <TableCell key={index} className={styles.tableHeadCell}>
                      <Typography variant="subtitle1">
                        {column.field}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead> */}
                <TableBody>
                  {products.items.map((product, index) => (
                    <TableRow key={index}>
                      {sortedColumns.map((column, index) => (
                        <TableCell key={index} className={styles.tableCell}>
                          {column.field === "Images" ? (
                            <CustomImage
                              src={
                                product.Images &&
                                product.Images.split(",")[0].trim()
                              }
                              alt="product"
                              width={45}
                              height={45}
                            />
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              {product[column.field]}
                            </Typography>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Pagination
          items={products.total_items}
          currentPage={currentPage}
          pageSize={products.items_per_page}
          onPageChange={onPageChange}
        />
      </Box>
    </Box>
  );
}
