"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  createTheme,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  useTheme,
} from "@mui/material";
import { fetchProductsData } from "./api/service";
import Sidebar from "./components/sidebar";
import Search from "./components/search";
import { Pagination } from "./components/pagination";
import Loading from "./loading";
import CustomImage from "./components/image";
import Navbar from "./components/navbar";

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

function HomePage() {
  const [products, setProducts] = useState<Products>({
    items: [],
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    items_per_page: 6,
  });

  const theme = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<string>("");
  const [placeholder, setPlaceholder] = useState("Search...");
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);

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

  useEffect(() => {
    setOpen(!isMobile);
    setLoading(true);
    fetchProductsData(currentPage, searchQuery, searchType)
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products data: ", error))
      .finally(() => setLoading(false));
  }, [currentPage, searchQuery, searchType, isMobile]);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        pt: "60px",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Navbar isOpen={isOpen} setOpen={setOpen} />
      </Box>

      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          sx={{
            position: { xs: "fixed", md: "sticky" },
            top: "60px",
            left: 0,
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            transform: {
              xs: isOpen ? "translateX(0)" : "translateX(-100%)",
              md: "translateX(0)",
            },
            transition: "transform 0.3s ease-in-out",
            zIndex: 999,
          }}
        >
          <Sidebar
            onMenuClick={(newPlaceholder, category, newSearchType) => {
              handleMenuClick(newPlaceholder, category, newSearchType);
              setOpen(false);
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            ml: { xs: 0 },
            minHeight: "calc(100vh - 60px)",
            overflow: "auto",
          }}
        >
          <Box sx={{ px: 3, pt: 3 }}>
            <Search
              placeholder={placeholder}
              onSearch={handleSearch}
              category={searchType}
              searchType={searchType}
            />
          </Box>

          <Container sx={{ flex: 1, px: 3, pt: 3 }}>
            {loading ? (
              <Loading />
            ) : (
              <TableContainer
                component={Paper}
                sx={{
                  overflowX: "auto",
                  "& .MuiTable-root": {
                    minWidth: {
                      xs: "100%",
                      sm: "650px",
                    },
                  },
                  "& .MuiTableCell-root": {
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: "0.8rem", sm: "1rem" },
                  },
                }}
              >
                <Table>
                  <TableBody>
                    {products.items.map((product, index) => (
                      <TableRow key={index}>
                        {columnConfig.map((column) => (
                          <TableCell
                            key={column.field}
                            sx={{
                              ...(column.field === "Images" && {
                                width: { xs: "60px", sm: "80px" },
                              }),
                            }}
                          >
                            {column.field === "Images" ? (
                              <CustomImage
                                src={product.Images?.split(",")[0].trim()}
                                alt="product"
                                width={45}
                                height={45}
                              />
                            ) : (
                              product[column.field]
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Container>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              items={products.total_items}
              currentPage={currentPage}
              pageSize={products.items_per_page}
              onPageChange={setCurrentPage}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage;
