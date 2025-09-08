"use client"

import {Box, CircularProgress, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useGridItemsPerPage} from "@/hooks/useGridItemsPerPage";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {useCatalogStore} from "@/features/catalog/store";
import {FilterFields, SearchFields} from "@/types/searchFields";
import {FiltersPanel} from "@/components/catalog/FiltersPanel";
import {Search} from "@/components/catalog/Search";
import {ProductSkeleton} from "@/components/skeletons/TableSkeleton";
import {ScrollToTop} from "@/components/ui/ScrollToTop";
import {useDictionary} from "@/providers/DictionaryProvider";
import {ProductsGrid} from "@/components/catalog/ProductsGrid";
import { createEmptyFilters, hasActiveFilters } from "@/utils/search";


export const CatalogPage = () => {
    const theme = useTheme();
    const itemsPerPage = useGridItemsPerPage();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const dict = useDictionary();
    const ref = useRef(null);

    const {
        items: products,
        search,
        filters,
        isLoading,
        currentPage,
        categoryName,
        fetchCatalog,
        categoryId,
        itemsPerPage: storeItemsPerPage,
        setItemsPerPage: setStoreItemsPerPage,
        setSearch,
        setFilters
    } = useCatalogStore();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const {isLoading, currentPage, totalPages, setPage} = useCatalogStore.getState();

                if (entries[0].isIntersecting && !isLoading && currentPage < totalPages) {
                    setPage(currentPage + 1);
                }
            },
            {threshold: 0.1}
        );

        const element = ref.current;
        if (element) observer.observe(element)
        return () => {element && observer.unobserve(element)};
    }, []);

    useEffect(() => {
        if (itemsPerPage !== null && storeItemsPerPage !== itemsPerPage) {
            setStoreItemsPerPage(itemsPerPage, true);
        }
    }, [itemsPerPage, storeItemsPerPage, setStoreItemsPerPage]);

    useEffect(() => {
        void fetchCatalog()
    }, [currentPage, fetchCatalog]);

    const handleFilterToggle = (
        categoryTitle: keyof FilterFields,
        itemValue: number,
        checked: boolean
    ) => {
        const currentIds = filters[categoryTitle] ?? [];
        const updatedIds = checked 
            ? [...currentIds, itemValue] 
            : currentIds.filter(id => id !== itemValue);
        
        setFilters({
            [categoryTitle]: updatedIds.length > 0 ? updatedIds : null 
        });
    };

    const clearAllFilters = () => { setFilters(createEmptyFilters()) }
    const searchSubmit = (searchFields: Partial<SearchFields>) => { setSearch(searchFields) }

    const isSearchActive = useMemo(() => hasActiveFilters(search), [search]);
    const areFiltersActive = useMemo(() => hasActiveFilters(filters), [filters]);

    const translatedCategoryName = categoryName && dict.sections.categories.titles?.[categoryName as keyof typeof dict.sections.categories.titles] || categoryName;

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
            mt: {xs: theme.spacing(6), sm: theme.spacing(7)},
        }}>
            {!isMobile &&
                <FiltersPanel
                    filters={filters}
                    onFilterToggle={handleFilterToggle}
                    onClearAllFilters={clearAllFilters}
                    isMobileDrawer={false}
                />
            }

            <Box component="main" sx={{ width: "100%" }}>
                <Box sx={{ pb: theme.spacing(2), mt: theme.spacing(4) }}>
                    <Search
                        onSearch={searchSubmit}
                        currentSearch={search}
                        currentFilters={filters}
                        onFilterToggle={handleFilterToggle}
                        onClearAllFilters={clearAllFilters}
                    />
                </Box>

                {categoryName && (
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            mb: { xs: theme.spacing(2), sm: theme.spacing(3) },
                            fontSize: { xs: theme.typography.h4.fontSize, sm: theme.typography.h3.fontSize },
                        }}
                    >
                        {translatedCategoryName}
                    </Typography>
                )}

                {(() => {
                    if (isLoading && products.length === 0) return <ProductSkeleton />;
                    if (products.length > 0) return <ProductsGrid products={products} />;

                    if (isLoading && products.length > 0) {
                        return (
                            <Box sx={{ textAlign: "center", my: { xs: theme.spacing(2), md: theme.spacing(3) } }}>
                                <CircularProgress aria-label={dict.catalog.loadingProducts} />
                            </Box>
                        );
                    }

                    return (
                        <Box
                            sx={{
                                textAlign: "center",
                                my: { xs: theme.spacing(2), md: theme.spacing(3) },
                                color: "text.secondary",
                            }}
                            role="status"
                            aria-live="polite"
                        >
                            {isSearchActive || areFiltersActive
                                ? dict.catalog.noItems
                                : categoryId
                                    ? dict.catalog.noItems
                                    : dict.catalog.startTyping}
                        </Box>
                    );
                })()}

                <Box
                    ref={ref}
                    sx={{visibility: isLoading && products.length > 0 ? "hidden" : "visible",}}
                />

                <ScrollToTop />
            </Box>
        </Box>
    );
}