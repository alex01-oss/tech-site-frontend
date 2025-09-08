import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { Product, CatalogResponse } from "@/features/catalog/types";
import { catalogApi } from "@/features/catalog/api";
import {FilterFields, SearchFields} from "@/types/searchFields";
import { createEmptyFilters, createEmptySearch } from "@/utils/search";

interface CatalogState {
    items: Product[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    categoryName: string | null;
    categoryId: number | null;
    search: SearchFields;
    filters: FilterFields;
    isLoading: boolean;
    error: string | null;
    loadedPages: Set<number>;

    fetchCatalog: () => Promise<void>;
    setPage: (page: number) => void;
    setCategory: (categoryId: number | null, categoryName: string | null) => void;
    setSearch: (searchFields: Partial<SearchFields>) => void;
    setFilters: (filterFields: Partial<FilterFields>) => void;
    setItemsPerPage: (count: number, resetPage: boolean) => void;
}

const resetPagination = (): Pick<CatalogState, 'currentPage' | 'loadedPages' | 'items' | 'error'> => ({
    currentPage: 1,
    loadedPages: new Set(),
    items: [],
    error: null,
});

const resetSearchAndFilters = (): Pick<CatalogState, 'search' | 'filters'> => ({
    search: createEmptySearch(),
    filters: createEmptyFilters()
});

const buildApiParams = (state: Pick<CatalogState, 'search' | 'filters' | 'categoryId' | 'currentPage' | 'itemsPerPage'>) => {
    const params: any = {
        category_id: state.categoryId,
        page: state.currentPage,
        items_per_page: state.itemsPerPage,
    }

    Object.entries(state.search).forEach(([key, value]) => {
        if (value) params[`search_${key}`] = value
    })

    Object.entries(state.filters).forEach(([key, value]) => {
        if (value?.length) params[key] = value
    })

    return params
};

export const useCatalogStore = create<CatalogState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            itemsPerPage: 12,
            categoryName: null,
            categoryId: null,
            search: createEmptySearch(),
            filters: createEmptyFilters(),
            isLoading: false,
            error: null,
            loadedPages: new Set(),

            fetchCatalog: async () => {
                const state = get()
                const {currentPage, loadedPages, isLoading} = state;

                if (isLoading || loadedPages.has(currentPage)) return;

                set({ isLoading: true, error: null });

                try {
                    const params = buildApiParams(state)
                    const res: CatalogResponse = await catalogApi.fetchCatalog(params);

                    set((prevState) => ({
                        items: currentPage === 1
                            ? res.items
                            : [...prevState.items, ...res.items],
                        totalItems: res.total_items,
                        totalPages: res.total_pages,
                        currentPage: res.current_page,
                        itemsPerPage: res.items_per_page,
                        loadedPages: new Set(prevState.loadedPages).add(currentPage),
                    }));
                } catch (e) {
                    console.error("Fetch catalog failed", e);
                    set({
                        ...resetPagination(),
                        error: e instanceof Error ? e.message : "Failed to fetch catalog",
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            setCategory: (categoryId, categoryName) => {
                set({ 
                    categoryId,
                    categoryName,
                    ...resetPagination(),
                    ...resetSearchAndFilters()
                });
                get().fetchCatalog()
            },

            setPage: (page: number) => {
                set({ currentPage: page, error: null });
            },

            setSearch: (newSearchFields: Partial<SearchFields>) => {
                set(state => {
                    const updatedSearch = {...state.search, ...newSearchFields};
                    if (shallow(state.search, updatedSearch)) return state
                    return {...state, search: updatedSearch, ...resetPagination()};
                });
                get().fetchCatalog()
            },

            setFilters: (newFilterFields: Partial<FilterFields>) => {
                set(state => {
                    const updatedFilters = {...state.filters, ...newFilterFields};
                    if (shallow(state.filters, updatedFilters)) return state
                    return {...state, filters: updatedFilters, ...resetPagination()};
                });
                get().fetchCatalog()
            },

            setItemsPerPage: (count: number, resetData: boolean = true) => {
                set((state) => {
                    if (state.itemsPerPage === count) return state;

                    return {
                        ...state,
                        itemsPerPage: count,
                        error: null,
                        ...(resetData && resetPagination())
                    };
                });
                get().fetchCatalog()
            }
        }),
        {
            name: 'catalog-storage',
            partialize: (state) => ({
                categoryId: state.categoryId,
                categoryName: state.categoryName,
            }),
        }
    )
);