import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { CatalogItem, CatalogResponse } from "@/features/catalog/types";
import { catalogApi } from "@/features/catalog/api";
import {FilterFields, SearchFields} from "@/types/searchFields";

interface CatalogState {
    items: CatalogItem[];
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

export const useCatalogStore = create<CatalogState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            itemsPerPage: 8,
            categoryName: null,
            categoryId: null,
            search: {
                code: null,
                shape: null,
                dimensions: null,
                machine: null,
            },
            filters: {
                bondIds: null,
                gridIds: null,
                mountingIds: null,
            },
            isLoading: false,
            error: null,
            loadedPages: new Set(),

            fetchCatalog: async () => {
                const {
                    categoryId,
                    search,
                    filters,
                    currentPage,
                    itemsPerPage,
                    loadedPages,
                    isLoading,
                } = get();

                if (isLoading || loadedPages.has(currentPage)) return;

                set({ isLoading: true, error: null });

                try {
                    const res: CatalogResponse = await catalogApi.fetchCatalog({
                        search_code: search.code || undefined,
                        search_shape: search.shape || undefined,
                        search_dimensions: search.dimensions || undefined,
                        search_machine: search.machine || undefined,
                        category_id: categoryId,
                        page: currentPage,
                        items_per_page: itemsPerPage,
                        bond_ids: filters.bondIds && filters.bondIds.length > 0 ? filters.bondIds : undefined,
                        grid_size_ids: filters.gridIds && filters.gridIds.length > 0 ? filters.gridIds : undefined,
                        mounting_ids: filters.mountingIds && filters.mountingIds.length > 0 ? filters.mountingIds : undefined
                    });

                    set((state) => ({
                        items: currentPage === 1
                            ? res.items
                            : [...state.items, ...res.items],
                        totalItems: res.total_items,
                        totalPages: res.total_pages,
                        currentPage: res.current_page,
                        itemsPerPage: res.items_per_page,
                        loadedPages: new Set(state.loadedPages).add(currentPage),
                    }));
                } catch (e) {
                    console.error("Fetch catalog failed", e);
                    set({
                        error: e instanceof Error ? e.message : "Failed to fetch catalog",
                        items: [],
                        totalItems: 0,
                        totalPages: 0,
                        currentPage: 1,
                        loadedPages: new Set()
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            setCategory: (categoryId, categoryName) => {
                set({ categoryId, categoryName, currentPage: 1, items: [] });
            },

            setPage: (page: number) => {
                set({ currentPage: page, error: null });
            },

            setSearch: (newSearchFields: Partial<SearchFields>) => {
                set(state => {
                    const updatedSearch = {
                        ...state.search,
                        ...newSearchFields
                    };

                    const hasChanged = !shallow(state.search, updatedSearch);

                    if (!hasChanged) return state
                    if (shallow(state.search, updatedSearch)) return state

                    return {
                        ...state,
                        search: updatedSearch,
                        ...resetPagination(),
                    };
                });
            },

            setFilters: (newFilterFields: Partial<FilterFields>) => {
                set(state => {
                    const updatedFilters = {
                        ...state.filters,
                        ...newFilterFields
                    };

                    const hasChanged = !shallow(state.filters, updatedFilters);

                    if (!hasChanged) {
                        return state;
                    }

                    return {
                        ...state,
                        filters: updatedFilters,
                        ...resetPagination(),
                    };
                });
            },

            setItemsPerPage: (count: number, resetPaginationAndCache: boolean = true) => {
                set((state) => {
                    if (state.itemsPerPage === count) {
                        return state;
                    }

                    const newState: Partial<CatalogState> = {
                        itemsPerPage: count,
                        error: null
                    };
                    if (resetPaginationAndCache) {
                        newState.currentPage = 1;
                        newState.loadedPages = new Set();
                        newState.items = [];
                    }
                    return { ...state, ...newState } as CatalogState;
                });
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