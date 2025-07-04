import {CatalogItem, CatalogResponse} from "@/features/catalog/types";
import {create} from "zustand";
import {fetchCatalog as apiFetchCatalog} from "@/features/catalog/api";

interface CatalogState {
    items: CatalogItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    search: string;
    searchType: string;
    nameBond: string | null;
    gridSize: string | null;
    isLoading: boolean;
    error: string | null;

    fetchCatalog: () => Promise<void>;
    setSearch: (search: string) => void;
    setSearchType: (type: string) => void;
    setPage: (page: number) => void;
    setNameBond: (bond: string | null) => void;
    setGridSize: (size: string | null) => void;
    resetFilters: () => void;
    resetSearch: () => void;
    updateItemInCart: (code: string, isInCart: boolean) => void;
}

const SEARCH_TYPES_REQUIRING_QUERY = ["code", "shape", "dimensions", "machine"];

export const useCatalogStore = create<CatalogState>((set, get) => ({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 8,
    search: "",
    searchType: "code",
    nameBond: null,
    gridSize: null,
    isLoading: false,
    error: null,

    fetchCatalog: async () => {
        const { search, searchType, currentPage, nameBond, gridSize, isLoading, itemsPerPage } = get();

        if (isLoading) {
            console.log("Fetch already in progress, preventing duplicate.");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            let actualSearchQuery: string | undefined = search.trim();
            if (actualSearchQuery === '' && SEARCH_TYPES_REQUIRING_QUERY.includes(searchType)) {
                actualSearchQuery = undefined;
            } else if (actualSearchQuery === '') {
                actualSearchQuery = undefined;
            }


            const res: CatalogResponse = await apiFetchCatalog({
                search: actualSearchQuery,
                search_type: searchType,
                page: currentPage,
                items_per_page: itemsPerPage,
                name_bond: nameBond || undefined,
                grid_size: gridSize || undefined,
            });

            set((state) => ({
                items: currentPage === 1
                    ? res.items
                    : [...state.items, ...res.items],
                totalItems: res.total_items,
                totalPages: res.total_pages,
                currentPage: res.current_page,
                itemsPerPage: res.items_per_page,
            }));
        } catch (e) {
            console.error("Fetch catalog failed", e);
            set({
                error: e instanceof Error ? e.message : "Failed to fetch catalog",
                items: [],
                totalItems: 0,
                totalPages: 0,
                currentPage: 1
            });
        } finally {
            set({ isLoading: false });
        }
    },

    setSearch: (search: string) => {
        set({
            search: search,
            currentPage: 1,
            error: null
        });
    },

    setSearchType: (type: string) => {
        set({
            searchType: type,
            currentPage: 1,
            error: null
        });
    },

    setPage: (page: number) => {
        set({ currentPage: page, error: null });
        get().fetchCatalog();
    },

    setNameBond: (bond: string | null) => {
        set({ nameBond: bond, currentPage: 1, error: null });
        get().fetchCatalog();
    },

    setGridSize: (size: string | null) => {
        set({ gridSize: size, currentPage: 1, error: null });
        get().fetchCatalog();
    },

    resetSearch: () => {
        set({
            search: "",
            searchType: "code",
            currentPage: 1,
            error: null,
        });
        get().fetchCatalog();
    },

    resetFilters: () => {
        set({
            nameBond: null,
            gridSize: null,
            currentPage: 1,
            error: null,
        });
        get().fetchCatalog();
    },

    updateItemInCart: (code: string, isInCart: boolean) => {
        set((state) => ({
            items: state.items.map(item =>
                item.code === code ? { ...item, is_in_cart: isInCart } : item
            )
        }));
    }
}));