"use client";

import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {Box, CircularProgress, Container, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";
import ProductSkeleton from "@/components/skeletons/TableSkeleton";
import ProductsTable from "@/components/common/ProductsTable";
import {useCatalogStore} from "@/features/catalog/store";
import Search from "@/components/common/Search";
import {useDataStore} from "@/features/data/store";
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
        bondIds,
        gridIds,
        isLoading,
        currentPage,
        totalPages,
        setPage,
        fetchCatalog,
        itemsPerPage: storeItemsPerPage,
        setItemsPerPage: setStoreItemsPerPage,
        setFiltersAndResetPage
    } = useCatalogStore();

    const filtersLoading = useDataStore(state => state.filtersLoading);

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
        bondIds,
        gridIds,
        searchCode,
        searchShape,
        searchDimensions,
        searchMachine,
    ]);

    const handleCombinedSearchSubmit = useCallback((
        searchFields: { code?: string; shape?: string; dimensions?: string; machine?: string },
    ) => {
        useCatalogStore.getState().setSearchAndResetPage(searchFields);
    }, []);

    const handleDesktopFilterToggle = useCallback(
        (categoryTitle: string, itemValue: number, checked: boolean) => {
            const currentBondIds = new Set(bondIds || []);
            const currentGridIds = new Set(gridIds || []);

            let newBondIds = bondIds;
            let newGridIds = gridIds;

            if (categoryTitle === "bonds") {
                if (checked) {
                    currentBondIds.add(itemValue);
                } else {
                    currentBondIds.delete(itemValue);
                }
                newBondIds = Array.from(currentBondIds).length > 0 ? Array.from(currentBondIds) : null;
            } else if (categoryTitle === "grids") {
                if (checked) {
                    currentGridIds.add(itemValue);
                } else {
                    currentGridIds.delete(itemValue);
                }
                newGridIds = Array.from(currentGridIds).length > 0 ? Array.from(currentGridIds) : null;
            }

            setFiltersAndResetPage(newBondIds, newGridIds);
        }, [bondIds, gridIds, setFiltersAndResetPage]);

    const handleDesktopClearAllFilters = useCallback(() => {
        setFiltersAndResetPage(null, null);
    }, [setFiltersAndResetPage]);

    const currentSearchFieldsForSearchComponent = useMemo(() => ({
        code: searchCode || undefined,
        shape: searchShape || undefined,
        dimensions: searchDimensions || undefined,
        machine: searchMachine || undefined,
    }), [searchCode, searchShape, searchDimensions, searchMachine]);

    const currentFiltersState = useMemo(() => {
        const filters: Record<string, Set<number>> = {};
        if (bondIds && bondIds.length > 0) filters["bonds"] = new Set(bondIds);
        if (gridIds && gridIds.length > 0) filters["grids"] = new Set(gridIds);
        return filters;
    }, [bondIds, gridIds]);

    return (
        <>
            <Toolbar/>

            <Container maxWidth="lg" sx={{
                flex: 1,
                display: 'flex',
                gap: 2,
            }}>
                {filtersLoading ? <SidebarSkeleton/> : !isMobile &&
                    <FiltersPanel
                        filters={currentFiltersState}
                        onFilterToggle={handleDesktopFilterToggle}
                        onClearAllFilters={handleDesktopClearAllFilters}
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
                    <Box sx={{px: 3, pb: 2, mt: 4}}>
                        <Search
                            onSearch={handleCombinedSearchSubmit}
                            currentSearchFields={currentSearchFieldsForSearchComponent}
                            currentFilters={currentFiltersState}
                            onFilterToggle={handleDesktopFilterToggle}
                            onClearAllFilters={handleDesktopClearAllFilters}
                        />
                    </Box>

                    <Box sx={{
                        position: "relative",
                        mx: {xs: 2, md: 3},
                        flexGrow: 1,
                        maxWidth: '100%',
                    }}>
                        {isLoading && products.length === 0
                            ? <ProductSkeleton/>
                            : <ProductsTable products={products}/>
                        }
                        {isLoading && products.length > 0 && (
                            <Box sx={{textAlign: "center", my: {xs: 2, md: 3}}}>
                                <CircularProgress/>
                            </Box>
                        )}
                        {!isLoading && products.length === 0 && (isSearchActive || bondIds || gridIds) && (
                            <Box sx={{textAlign: "center", my: {xs: 2, md: 3}, color: 'text.secondary'}}>
                                No items found for the current filters.
                            </Box>
                        )}
                        {!isLoading && products.length === 0 && !isSearchActive && !bondIds && !gridIds && (
                            <Box sx={{textAlign: "center", my: {xs: 2, md: 3}, color: 'text.secondary'}}>
                                Start typing or select a filter to find items.
                            </Box>
                        )}
                        <Box ref={ref} sx={{
                            height: theme.spacing(3),
                            visibility: isLoading && products.length > 0 ? 'hidden' : 'visible'
                        }}/>
                        <ScrollToTopFab/>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default CatalogPage;