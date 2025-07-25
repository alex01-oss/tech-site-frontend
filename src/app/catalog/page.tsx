"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Box, CircularProgress, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";
import ProductSkeleton from "@/components/skeletons/TableSkeleton";
import ProductsTable from "@/components/common/productsTable";
import {useCatalogStore} from "@/features/catalog/store";
import Search from "@/components/common/Search";
import {useMenuStore} from "@/features/menu/store";
import {useGridItemsPerPage} from "@/hooks/useGridItemsPerPage";
import FiltersPanel from "@/components/layout/FiltersPanel";
import ScrollToTopFab from "@/components/common/ScrollToTopFab";

function CatalogPage() {
    const theme = useTheme();

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

    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isLoading && currentPage < totalPages) {
                setPage(currentPage + 1);
            }
        }, {threshold: 0.1});

        if (ref.current) observer.current.observe(ref.current)

        return () => {
            if (observer.current) observer.current.disconnect()
        };
    }, [isLoading, currentPage, totalPages, setPage]);

    useEffect(() => {
        if (itemsPerPage !== null && storeItemsPerPage !== itemsPerPage) {
            setStoreItemsPerPage(itemsPerPage, true);
        }
    }, [itemsPerPage, storeItemsPerPage, setStoreItemsPerPage]);

    useEffect(() => {
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

    const [localFiltersState, setLocalFiltersState] = useState<Record<string, Set<string>>>({});

    useEffect(() => {
        const initialFilters: Record<string, Set<string>> = {};
        if (nameBond) {
            initialFilters["Bond"] = new Set([nameBond]);
        }
        if (gridSize) {
            initialFilters["Grid Size"] = new Set([gridSize]);
        }
        setLocalFiltersState(initialFilters);
    }, [nameBond, gridSize]);

    const handleCombinedSearchSubmit = useCallback((
        searchFields: { code?: string; shape?: string; dimensions?: string; machine?: string },
        filtersFromSearchComponent: Record<string, Set<string>>
    ) => {
        useCatalogStore.getState().setSearchAndResetPage(searchFields);

        const newFiltersForStore: Record<string, string[]> = {};
        for (const category in filtersFromSearchComponent) {
            if (filtersFromSearchComponent.hasOwnProperty(category)) {
                newFiltersForStore[category] = Array.from(filtersFromSearchComponent[category]);
            }
        }

        const newNameBond = newFiltersForStore["Bond"] && newFiltersForStore["Bond"].length > 0 ? newFiltersForStore["Bond"][0] : null;
        const newGridSize = newFiltersForStore["Grid Size"] && newFiltersForStore["Grid Size"].length > 0 ? newFiltersForStore["Grid Size"][0] : null;

        if (newNameBond !== nameBond || newGridSize !== gridSize) {
            useCatalogStore.getState().setFiltersAndResetPage(newNameBond, newGridSize);
        }
    }, [nameBond, gridSize]);


    const handleDesktopFilterToggle = useCallback((categoryTitle: string, itemValue: string, checked: boolean) => {
        setLocalFiltersState((prevFilters) => {
            const currentCategoryFilters = prevFilters[categoryTitle] || new Set();
            const newCategoryFilters = new Set(currentCategoryFilters);

            if (checked) {
                newCategoryFilters.add(itemValue);
            } else {
                newCategoryFilters.delete(itemValue);
            }

            if (newCategoryFilters.size === 0) {
                const {[categoryTitle]: _, ...rest} = prevFilters;
                return rest;
            }

            const updatedFilters = {
                ...prevFilters,
                [categoryTitle]: newCategoryFilters,
            };

            const newFiltersForStore: Record<string, string[]> = {};
            for (const category in updatedFilters) {
                if (updatedFilters.hasOwnProperty(category)) {
                    newFiltersForStore[category] = Array.from(updatedFilters[category]);
                }
            }

            const newNameBond = newFiltersForStore["Bond"] && newFiltersForStore["Bond"].length > 0 ? newFiltersForStore["Bond"][0] : null;
            const newGridSize = newFiltersForStore["Grid Size"] && newFiltersForStore["Grid Size"].length > 0 ? newFiltersForStore["Grid Size"][0] : null;

            useCatalogStore.getState().setFiltersAndResetPage(newNameBond, newGridSize);

            return updatedFilters;
        });
    }, []);

    const handleDesktopClearAllFilters = useCallback(() => {
        setLocalFiltersState({});
        useCatalogStore.getState().setFiltersAndResetPage(null, null);
    }, []);

    const handleDesktopApplyFilters = useCallback(() => {
        console.log("Desktop filters applied (implicitly on toggle).");
    }, []);

    const currentSearchFieldsForSearchComponent = useMemo(() => ({
        code: searchCode || undefined,
        shape: searchShape || undefined,
        dimensions: searchDimensions || undefined,
        machine: searchMachine || undefined,
    }), [searchCode, searchShape, searchDimensions, searchMachine]);

    const currentFiltersForSearchComponent = useMemo(() => {
        const filters: Record<string, string[]> = {};
        if (nameBond) {
            filters["Bond"] = [nameBond];
        }
        if (gridSize) {
            filters["Grid Size"] = [gridSize];
        }
        return filters;
    }, [nameBond, gridSize]);

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
                {menuLoading ? <SidebarSkeleton/> : !isMobile &&
                    <FiltersPanel
                        filters={localFiltersState}
                        onFilterToggle={handleDesktopFilterToggle}
                        onClearAllFilters={handleDesktopClearAllFilters}
                        onApplyFilters={handleDesktopApplyFilters}
                        isMobileDrawer={false}
                    />
                }

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
                            currentSearchFields={currentSearchFieldsForSearchComponent}
                            currentFilters={currentFiltersForSearchComponent}
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
                        <ScrollToTopFab />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default CatalogPage;