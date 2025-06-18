import { CatalogItem, CatalogResponse } from "@/features/catalog/types";
import { create } from "zustand";
import { fetchCatalog } from "@/features/catalog/api";

interface CatalogState {
    items: CatalogItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    search: string;
    searchType: string;
    isLoading: boolean;
    error: string | null;

    fetchCatalog: () => Promise<void>;
    setSearch: (search: string, type?: string) => void;
    setPage: (page: number) => void;
    resetSearch: () => void;
    updateItemInCart: (code: string, isInCart: boolean) => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 8,
    search: "",
    searchType: "code",
    isLoading: false,
    error: null,

    fetchCatalog: async () => {
        const { search, searchType, currentPage} = get();

        set({ isLoading: true, error: null });

        try {
            const res: CatalogResponse = await fetchCatalog({
                search: search || undefined,
                search_type: searchType || undefined,
                page: currentPage,
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
                totalPages: 0
            });
        } finally {
            set({ isLoading: false });
        }
    },

    setSearch: (search: string, type: string = "code") => {
        set({
            search: search.trim(),
            searchType: type,
            currentPage: 1,
            error: null
        });
    },

    setPage: (page: number) => {
        set({ currentPage: page, error: null });
    },

    resetSearch: () => {
        set({
            search: "",
            searchType: "code",
            currentPage: 1,
            error: null
        });
    },

    updateItemInCart: (code: string, isInCart: boolean) => {
        set((state) => ({
            items: state.items.map(item =>
                item.code === code ? { ...item, is_in_cart: isInCart } : item
            )
        }));
    }
}));