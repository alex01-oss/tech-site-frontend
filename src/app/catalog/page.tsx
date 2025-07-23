"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, CircularProgress, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";
import Sidebar from "@/components/layout/Sidebar";
import ProductSkeleton from "@/components/skeletons/TableSkeleton";
import ProductsTable from "@/components/common/productsTable";
import {useCatalogStore} from "@/features/catalog/store";
import Search from "@/components/common/search";
import {useMenuStore} from "@/features/menu/store";
import {useGridItemsPerPage} from "@/hooks/useGridItemsPerPage";
import {SearchField} from "@/types/searchField";

function CatalogPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [isOpen, setOpen] = useState(true);

    const {
        items: products,
        searchCode,
        searchShape,
        searchDimensions,
        searchMachine,
        nameBond,
        gridSize,
        isLoading,
        currentPage,
        totalPages,
        setPage,
        fetchCatalog,
        itemsPerPage: storeItemsPerPage,
        setItemsPerPage: setStoreItemsPerPage,
    } = useCatalogStore();

    const menuLoading = useMenuStore(state => state.loading);

    const observer = useRef<IntersectionObserver | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    const itemsPerPage = useGridItemsPerPage()

    const isSearchActive = useMemo(() => {
        return searchCode || searchShape || searchDimensions || searchMachine;
    }, [searchCode, searchShape, searchDimensions, searchMachine]);

    useEffect(() => {
        setOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isLoading && currentPage < totalPages) {
                setPage(currentPage + 1);
            }
        }, {threshold: 0.1});

        if (ref.current) {
            observer.current.observe(ref.current);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [isLoading, currentPage, totalPages, setPage]);

    useEffect(() => {
        if (itemsPerPage !== null && storeItemsPerPage !== itemsPerPage) {
            setStoreItemsPerPage(itemsPerPage, true);
        }
    }, [itemsPerPage, storeItemsPerPage, setStoreItemsPerPage]);

    useEffect(() => {
        if (itemsPerPage === null) return;
        fetchCatalog().then()
    }, [
        fetchCatalog,
        currentPage,
        storeItemsPerPage,
        nameBond, gridSize,
        searchCode,
        searchShape,
        searchDimensions,
        searchMachine,
    ]);

    const handleCombinedSearchSubmit = useCallback((searchFields: SearchField[]) => {
        useCatalogStore.getState().setSearchAndResetPage(searchFields);
    }, []);

    const handleFilterChangeFromSidebar = useCallback((filters: Record<string, string[]>) => {
        const newNameBond = filters["Bond"] && filters["Bond"].length > 0 ? filters["Bond"][0] : null;
        const newGridSize = filters["Grid Size"] && filters["Grid Size"].length > 0 ? filters["Grid Size"][0] : null;

        if (newNameBond !== nameBond || newGridSize !== gridSize) {
            useCatalogStore.getState().setFiltersAndResetPage(newNameBond, newGridSize);
        }
    }, [nameBond, gridSize]);

    const memoizedInitialSearchFields = useMemo(() => {
        const fields: SearchField[] = [];
        if (searchCode) fields.push({id: 'code-field', value: searchCode, type: 'code'});
        if (searchShape) fields.push({id: 'shape-field', value: searchShape, type: 'shape'});
        if (searchDimensions) fields.push({id: 'dimensions-field', value: searchDimensions, type: 'dimensions'});
        if (searchMachine) fields.push({id: 'machine-field', value: searchMachine, type: 'machine'});

        if (fields.length === 0) {
            return [{id: 'field-0', value: '', type: 'code'}];
        }
        return fields;
    }, [searchCode, searchShape, searchDimensions, searchMachine]);

    return (
        <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
            <Toolbar/>

            <Box sx={{
                maxWidth: 'lg',
                width: '100%',
                mx: 'auto',
                flex: 1,
                display: 'flex',
                px: {xs: 0, lg: 2},
            }}>
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
                        }}
                    />
                )}

                {menuLoading ? <SidebarSkeleton/> : <Sidebar onFilterChange={handleFilterChangeFromSidebar}/>}

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        transition: theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.enteringScreen,
                        }),
                        overflowX: 'hidden',
                        minWidth: 0,
                    }}
                >
                    <Box sx={{p: {xs: 2, md: 3}}}>
                        <Search
                            onSearch={handleCombinedSearchSubmit}
                            initialSearchFields={memoizedInitialSearchFields}
                        />
                    </Box>

                    <Box sx={{
                        position: "relative",
                        mx: {xs: 2, md: 3},
                        flexGrow: 1,
                        maxWidth: '100%',
                    }}>
                        {isLoading && products.length === 0 ? (
                            <ProductSkeleton/>
                        ) : (
                            <ProductsTable products={products}/>
                        )}
                        {isLoading && products.length > 0 && (
                            <Box sx={{textAlign: "center", my: {xs: 2, md: 3}}}>
                                <CircularProgress/>
                            </Box>
                        )}
                        {!isLoading && products.length === 0 && (isSearchActive || nameBond || gridSize) && (
                            <Box sx={{textAlign: "center", my: {xs: 2, md: 3}, color: 'text.secondary'}}>
                                No items found for the current filters.
                            </Box>
                        )}
                        {!isLoading && products.length === 0 && !isSearchActive && !nameBond && !gridSize && (
                            <Box sx={{textAlign: "center", my: {xs: 2, md: 3}, color: 'text.secondary'}}>
                                Start typing or select a filter to find items.
                            </Box>
                        )}
                        <Box ref={ref} sx={{
                            height: theme.spacing(3),
                            visibility: isLoading && products.length > 0 ? 'hidden' : 'visible'
                        }}/>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CatalogPage;