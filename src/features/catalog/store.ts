import {CatalogItem, CatalogResponse, SearchField} from "@/features/catalog/types";
import { create } from "zustand";
import {catalogApi} from "@/features/catalog/api";

interface CatalogState {
    items: CatalogItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    searchCode: string | null;
    searchShape: string | null;
    searchDimensions: string | null;
    searchMachine: string | null;
    nameBond: string | null;
    gridSize: string | null;
    isLoading: boolean;
    error: string | null;

    fetchCatalog: () => Promise<void>;
    setSearchCode: (code: string | null) => void;
    setSearchShape: (shape: string | null) => void;
    setSearchDimensions: (dimensions: string | null) => void;
    setSearchMachine: (machine: string | null) => void;
    setPage: (page: number) => void;
    setNameBond: (bond: string | null) => void;
    setGridSize: (size: string | null) => void;
    resetFilters: () => void;
    resetSearch: () => void;
    setSearchAndResetPage(searchFields: SearchField[]): void;
    setFiltersAndResetPage(newNameBond: string | null, newGridSize: string | null): void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
    items: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 8,
    searchCode: null,
    searchShape: null,
    searchDimensions: null,
    searchMachine: null,
    nameBond: null,
    gridSize: null,
    isLoading: false,
    error: null,

    fetchCatalog: async () => {
        const {
            searchCode,
            searchShape,
            searchDimensions,
            searchMachine,
            currentPage,
            nameBond,
            gridSize,
            isLoading,
            itemsPerPage
        } = get();

        if (isLoading) {
            console.log("Fetch already in progress, preventing duplicate.");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            const res: CatalogResponse = await catalogApi.fetchCatalog({
                search_code: searchCode || undefined,
                search_shape: searchShape || undefined,
                search_dimensions: searchDimensions || undefined,
                search_machine: searchMachine || undefined,
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

    setSearchCode: (code: string | null) => {
        set({ searchCode: code, currentPage: 1, error: null });
    },
    setSearchShape: (shape: string | null) => {
        set({ searchShape: shape, currentPage: 1, error: null });
    },
    setSearchDimensions: (dimensions: string | null) => {
        set({ searchDimensions: dimensions, currentPage: 1, error: null });
    },
    setSearchMachine: (machine: string | null) => {
        set({ searchMachine: machine, currentPage: 1, error: null });
    },

    setPage: (page: number) => {
        set({ currentPage: page, error: null });
    },

    setNameBond: (bond: string | null) => {
        set({ nameBond: bond, currentPage: 1, error: null });
    },

    setGridSize: (size: string | null) => {
        set({ gridSize: size, currentPage: 1, error: null });
    },

    resetSearch: () => {
        set({
            searchCode: null,
            searchShape: null,
            searchDimensions: null,
            searchMachine: null,
            currentPage: 1,
            error: null,
        });
    },

    resetFilters: () => {
        set({
            nameBond: null,
            gridSize: null,
            currentPage: 1,
            error: null,
        });
    },

    setSearchAndResetPage: (newSearchFields: SearchField[]) => {
        set(state => {
            const newState = { ...state, currentPage: 1 };
            newSearchFields.forEach(field => {
                const valueToSet = field.value.trim() === '' ? null : field.value;
                switch (field.type) {
                    case 'code':
                        newState.searchCode = valueToSet;
                        break;
                    case 'shape':
                        newState.searchShape = valueToSet;
                        break;
                    case 'dimensions':
                        newState.searchDimensions = valueToSet;
                        break;
                    case 'machine':
                        newState.searchMachine = valueToSet;
                        break;
                    default:
                        break;
                }
            });
            if (!newSearchFields.some(f => f.type === 'code')) newState.searchCode = null;
            if (!newSearchFields.some(f => f.type === 'shape')) newState.searchShape = null;
            if (!newSearchFields.some(f => f.type === 'dimensions')) newState.searchDimensions = null;
            if (!newSearchFields.some(f => f.type === 'machine')) newState.searchMachine = null;

            return newState;
        });
    },

    setFiltersAndResetPage: (newNameBond: string | null, newGridSize: string | null) => {
        set(state => ({
            ...state,
            nameBond: newNameBond,
            gridSize: newGridSize,
            currentPage: 1,
        }));
    },
}));