import {create} from "zustand";
import {persist} from "zustand/middleware";
import {menuApi} from "@/features/data/api";
import {Category, FilterResponse} from "@/features/data/types";

export interface DataState {
    filters: FilterResponse | null;
    categories: Category[];

    filtersLoading: boolean;
    categoriesLoading: boolean;

    filtersError: string | null;
    categoriesError: string | null;

    filtersFetched: boolean;
    categoriesFetched: boolean;

    fetchFilters: () => Promise<void>;
    fetchCategories: () => Promise<void>;
}

export const useDataStore = create<DataState>()(
    persist(
        (set, get) => ({
            filters: null,
            categories: [],

            filtersLoading: false,
            categoriesLoading: false,

            filtersError: null,
            categoriesError: null,

            filtersFetched: false,
            categoriesFetched: false,

            fetchFilters: async () => {
                if (get().filtersFetched) {
                    return;
                }
                try {
                    set({ filtersLoading: true, filtersError: null });
                    const response = await menuApi.getFilters();
                    set({
                        filters: response,
                        filtersFetched: true,
                    });
                } catch (e) {
                    console.error("Fetch filters failed", e);
                    set({ filtersError: e instanceof Error ? e.message : "Failed to fetch filters" });
                } finally {
                    set({ filtersLoading: false });
                }
            },

            fetchCategories: async () => {
                if (get().categoriesFetched) {
                    return;
                }
                try {
                    set({ categoriesLoading: true, categoriesError: null });
                    const response = await menuApi.getCategories();
                    set({
                        categories: response,
                        categoriesFetched: true,
                    });
                } catch (e) {
                    console.error("Fetch categories failed", e);
                    set({ categoriesError: e instanceof Error ? e.message : "Failed to fetch categories" });
                } finally {
                    set({ categoriesLoading: false });
                }
            },
        }),
        {
            name: "data-store",
            partialize: (state) => ({
                filters: state.filters,
                categories: state.categories,
            }),
        }
    )
);