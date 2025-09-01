"use client"

import {Box, CircularProgress, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useGridItemsPerPage} from "@/hooks/useGridItemsPerPage";
import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {useCatalogStore} from "@/features/catalog/store";
import {SearchFields} from "@/types/searchFields";
import {FiltersPanel} from "@/components/catalog/FiltersPanel";
import {Search} from "@/components/catalog/Search";
import {ProductSkeleton} from "@/components/skeletons/TableSkeleton";
import {ScrollToTop} from "@/components/ui/ScrollToTop";
import {useDictionary} from "@/providers/DictionaryProvider";
import {ProductsGrid} from "@/components/catalog/ProductsGrid";


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

        return () => {
            if (element) observer.unobserve(element);
        };
    }, []);

    useEffect(() => {
        if (itemsPerPage !== null && storeItemsPerPage !== itemsPerPage) {
            setStoreItemsPerPage(itemsPerPage, true);
        }
    }, [itemsPerPage, storeItemsPerPage, setStoreItemsPerPage]);

    useEffect(() => {
        void fetchCatalog()
    }, [currentPage, storeItemsPerPage, categoryId, search, filters]);

    const handleCombinedSearchSubmit = useCallback((
        searchFields: Partial<SearchFields>,
    ) => {
        setSearch(searchFields);
    }, [setSearch]);

    const handleFilterToggle = useCallback(
        (categoryTitle: string, itemValue: number, checked: boolean) => {
            const getUpdatedIds = (currentIds: number[] | null | undefined, isTarget: boolean) => {
                if (!isTarget) return currentIds;

                const current = currentIds || [];
                const updated = checked
                    ? [...current, itemValue]
                    : current.filter((id: number) => id !== itemValue);

                return updated.length > 0 ? updated : null;
            };

            setFilters({
                bondIds: getUpdatedIds(filters.bondIds, categoryTitle === "bonds"),
                gridIds: getUpdatedIds(filters.gridIds, categoryTitle === "grids"),
                mountingIds: getUpdatedIds(filters.mountingIds, categoryTitle === "mountings"),
            });
        }, [filters, setFilters]
    );


    const handleClearAllFilters = useCallback(() => {
        setFilters({bondIds: null, gridIds: null, mountingIds: null});
    }, [setFilters]);

    const currentSearchFieldsForSearchComponent = useMemo(() => search, [search]);

    const currentFiltersState = useMemo(() => {
        const currentFilters: Record<string, Set<number>> = {};
        if (filters.bondIds && filters.bondIds.length > 0) currentFilters["bonds"] = new Set(filters.bondIds);
        if (filters.gridIds && filters.gridIds.length > 0) currentFilters["grids"] = new Set(filters.gridIds);
        if (filters.mountingIds && filters.mountingIds.length > 0) currentFilters["mountings"] = new Set(filters.mountingIds);
        return currentFilters;
    }, [filters]);

    const isSearchActive = useMemo(() => {
        return !!search.code || !!search.shape || !!search.dimensions || !!search.machine;
    }, [search]);

    const areFiltersActive = useMemo(() => {
        return (filters.bondIds && filters.bondIds.length > 0) ||
            (filters.gridIds && filters.gridIds.length > 0) ||
            (filters.mountingIds && filters.mountingIds.length > 0);
    }, [filters]);

    let translatedCategoryName = categoryName;

    if (categoryName && dict.sections.categories.titles && categoryName in dict.sections.categories.titles) {
        translatedCategoryName = dict.sections.categories.titles[categoryName as keyof typeof dict.sections.categories.titles];
    }

    return (
        <Box sx={{
            flex: 1,
            display: 'flex',
            gap: {xs: theme.spacing(2), sm: theme.spacing(3)},
            mt: {xs: theme.spacing(6), sm: theme.spacing(7)},
        }}>
            {!isMobile &&
                <FiltersPanel
                    filters={currentFiltersState}
                    onFilterToggle={handleFilterToggle}
                    onClearAllFilters={handleClearAllFilters}
                    isMobileDrawer={false}
                />
            }

            <Box component="main" sx={{ width: "100%" }}>
                <Box sx={{ pb: theme.spacing(2), mt: theme.spacing(4) }}>
                    <Search
                        onSearch={handleCombinedSearchSubmit}
                        currentSearchFields={currentSearchFieldsForSearchComponent}
                        currentFilters={currentFiltersState}
                        onFilterToggle={handleFilterToggle}
                        onClearAllFilters={handleClearAllFilters}
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