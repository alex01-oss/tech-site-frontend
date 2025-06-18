"use client";

import React, {useCallback, useEffect} from "react";
import {Box, CircularProgress, useMediaQuery, useTheme} from "@mui/material";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";
import Sidebar from "@/components/layout/sidebar";
import ProductSkeleton from "@/components/skeletons/TableSkeleton";
import ProductsTable from "@/components/common/productsTable";
import {useCatalogStore} from "@/features/catalog/store";
import Search from "@/components/common/search";
import {useToggle} from "@/shared/ui/useToggle";
import {useMenuStore} from "@/features/menu/store";
import {useInfiniteScroll} from "@/hooks/useInfiniteScroll";

function HomePage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [isOpen, , setOpen] = useToggle();

    const {
        items: products,
        search,
        searchType,
        isLoading,
        setSearch,
    } = useCatalogStore();

    const menuLoading = useMenuStore(state => state.loading);

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile, isOpen]);

    const handleSearch = useCallback((query: string, type: string) => {
        setSearch(query, type);
    }, [setSearch]);

    const handleMenuClick = useCallback((newSearchType: string) => {
        setSearch("", newSearchType);
        if (isMobile) {
            setOpen(false);
        }
    }, [setSearch, isMobile, setOpen]);

    const { ref } = useInfiniteScroll()

    const getPlaceholder = () => {
        switch (searchType) {
            case "shape":
                return "Enter shape";
            case "dimensions":
                return "Enter dimensions";
            case "machine":
                return "Enter your machine";
            default:
                return "Enter code";
        }
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh", pt: "60px"}}>
            <Box sx={{display: "flex", flex: 1}}>
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
                            zIndex: 998
                        }}
                    />
                )}

                <Box
                    sx={{
                        position: {xs: "fixed", md: "sticky"},
                        top: "60px",
                        height: "calc(100vh - 60px)",
                        overflowY: "auto",
                        transform: {
                            xs: isOpen ? "translateX(0)" : "translateX(-100%)",
                            md: "translateX(0)"
                        },
                        transition: "transform 0.3s ease-in-out",
                    }}
                >
                    {menuLoading ? <SidebarSkeleton/> : <Sidebar onMenuClick={handleMenuClick}/>}
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', ml: { xs: 0 } }}>
                    <Box sx={{ p: 3 }}>
                        <Search
                            placeholder={getPlaceholder()}
                            onSearch={handleSearch}
                            searchType={searchType}
                            value={search}
                        />
                    </Box>

                    <Box sx={{ position: "relative", mx: 3, flexGrow: 1 }}>
                        {isLoading ? (
                            <ProductSkeleton />
                        ) : (
                            <ProductsTable products={products} />
                        )}
                        <Box ref={ref} sx={{ height: 20 }} />
                    </Box>

                    {isLoading && (
                        <Box sx={{ textAlign: "center", my: 3 }}>
                            <CircularProgress />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default HomePage