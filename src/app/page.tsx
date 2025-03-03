"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { fetchData } from "./api/service";
import Sidebar from "./components/sidebar";
import Search from "./components/search";
import { Pagination } from "./components/pagination";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import FooterSkeleton from "./components/skeletons/FooterSkeleton";
import ProductSkeleton from "./components/skeletons/TableSkeleton";
import NavbarSkeleton from "./components/skeletons/NavbarSkeleton";
import SidebarSkeleton from "./components/skeletons/SidebarSkeleton";
import PaginationSkeleton from "./components/skeletons/PaginationSkeleton";
import SearchSkeleton from "./components/skeletons/SearchSkeleton";
import ProductTable from "./components/table";

interface Product {
  Title: string;
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
  const [tileHeight] = useState("50px");

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchProductsData = useCallback(async () => {
    if (!searchQuery && !currentPage) return;

    try {
      const data = await fetchData(
        `catalog?search=${encodeURIComponent(
          searchQuery
        )}&search_type=${searchType}&page=${currentPage}`
      );
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products data: ", error);
    } finally {
    }
  }, [currentPage, searchQuery, searchType]);

  const handleMenuClick = useCallback(
    (newPlaceholder: string, category: string, newSearchType: string) => {
      setPlaceholder(newPlaceholder);
      setSearchType(newSearchType);
      setSearchQuery("");
    },
    []
  );

  useEffect(() => {
    // setLoading(true);
    fetchProductsData();
  }, [fetchProductsData]);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await fetchProductsData();
      setLoading(false);
    };

    initialLoad();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchProductsData();
    }
  }, [fetchData, loading]);

  const [signed, setSigned] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setSigned(!!user);
  }, []);

  const handleSearch = useCallback(
    (query: string, category: string, searchType: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      setSearchType(searchType);
    },
    []
  );

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
      {/* NAVBAR */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        {loading ? (
          <NavbarSkeleton />
        ) : (
          <Navbar isOpen={isOpen} setOpen={setOpen} signed={signed} />
        )}
      </Box>

      {/* CONTENT */}
      <Box sx={{ display: "flex", flex: 1 }}>
        {isOpen && isMobile && (
          <Box
            onClick={() => setOpen(false)}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 998,
              transition: "opacity 0.3s ease",
            }}
          />
        )}

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
          {/* SIDEBAR */}
          {loading ? (
            <SidebarSkeleton />
          ) : (
            <Sidebar
              onMenuClick={(newPlaceholder, category, newSearchType) => {
                handleMenuClick(newPlaceholder, category, newSearchType);
                setOpen(false);
              }}
            />
          )}
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
          {/* SEARCH */}
          <Box sx={{ px: 3, pt: 3 }}>
            {loading ? (
              <SearchSkeleton />
            ) : (
              <Search
                placeholder={placeholder}
                onSearch={handleSearch}
                category={searchType}
                searchType={searchType}
              />
            )}
          </Box>

          {/* PRODUCTS TABLE */}
          <Box sx={{ position: "relative" }}>
            {loading ? (
              <ProductSkeleton />
            ) : (
              <ProductTable
                products={products.items}
                tileHeight={tileHeight}
                signed={signed}
              />
            )}
          </Box>

          {/* PAGINATION */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {loading ? (
              <PaginationSkeleton />
            ) : (
              <Pagination
                items={products.total_items}
                currentPage={currentPage}
                pageSize={products.items_per_page}
                onPageChange={setCurrentPage}
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box>{loading ? <FooterSkeleton /> : <Footer />}</Box>
    </Box>
  );
}

export default HomePage;
