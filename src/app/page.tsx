"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { fetchData } from "./api/service";
import Sidebar from "./components/sidebar";
import Search from "./components/search";
import { Pagination } from "./components/pagination";
import ProductSkeleton from "./components/skeletons/TableSkeleton";
import SidebarSkeleton from "./components/skeletons/SidebarSkeleton";
import PaginationSkeleton from "./components/skeletons/PaginationSkeleton";
import SearchSkeleton from "./components/skeletons/SearchSkeleton";
import { useStore } from "./store/useStore";
import WoodTable from "./components/woodworkingTable";

interface Product {
  code: string;
  shape: string;
  dimensions: string;
  images: string;
  is_in_cart?: boolean;
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    items_per_page: 8,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("code");
  const [placeholder, setPlaceholder] = useState("By code");
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { isOpen, setOpen } = useStore();

  const fetchProductsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchData(
        `catalog?search=${encodeURIComponent(searchQuery)}&search_type=${searchType}&page=${pagination.current_page}`
      );

      setProducts(data.items);
      setPagination((prev) => ({
        ...prev,
        total_items: data.total_items,
        total_pages: data.total_pages,
      }));
    } catch (e) {
      console.error("Error fetching catalog", e);
    } finally {
      setLoading(false);
    }
  }, [pagination.current_page, searchQuery, searchType]);

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleSearch = useCallback((query: string, _: string, type: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    setSearchType(type);
  }, []);

  const handleMenuClick = useCallback((newPlaceholder: string, _: string, type: string) => {
    setPlaceholder(newPlaceholder);
    setSearchType(type);
    setSearchQuery("");
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", pt: "60px" }}>
      <Box sx={{ display: "flex", flex: 1 }}>
        {isOpen && isMobile && (
          <Box
            onClick={() => setOpen(false)}
            sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.3)", zIndex: 998 }}
          />
        )}

        <Box
          sx={{
            position: { xs: "fixed", md: "sticky" },
            top: "60px",
            height: "calc(100vh - 60px)",
            overflowY: "auto",
            transform: { xs: isOpen ? "translateX(0)" : "translateX(-100%)", md: "translateX(0)" },
            zIndex: 999,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {loading ? (
            <SidebarSkeleton />
          ) : (
            <Sidebar
              onMenuClick={(ph, cat, type) => {
                handleMenuClick(ph, cat, type);
                setOpen(false);
              }}
            />
          )}
        </Box>

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", ml: { xs: 0 } }}>
          <Box sx={{ p: 3 }}>
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

          <Box sx={{ position: "relative", mx: 3 }}>
            {loading ? <ProductSkeleton /> : <WoodTable products={products} setProducts={setProducts} />}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {loading ? (
              <PaginationSkeleton />
            ) : (
              <Pagination
                items={pagination.total_items}
                currentPage={pagination.current_page}
                pageSize={pagination.items_per_page}
                onPageChange={(page) => setPagination((prev) => ({ ...prev, current_page: page }))}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default HomePage