import {CatalogItem, CatalogResponse} from "@/features/catalog/types";
import {create} from "zustand";
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
    loadedPages: Set<number>;

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

    setSearchAndResetPage(searchFields: { code?: string; shape?: string; dimensions?: string; machine?: string }): void;
    setFiltersAndResetPage(newNameBond: string | null, newGridSize: string | null): void;
    setItemsPerPage: (count: number, resetPage: boolean) => void;
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
    loadedPages: new Set(),

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
            itemsPerPage,
            loadedPages
        } = get();

        if (isLoading || loadedPages.has(currentPage)) return

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

    setSearchCode: (code: string | null) => {
        set({
            searchCode: code,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null
        });
    },
    setSearchShape: (shape: string | null) => {
        set({
            searchShape: shape,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null
        });
    },
    setSearchDimensions: (dimensions: string | null) => {
        set({
            searchDimensions: dimensions,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null
        });
    },
    setSearchMachine: (machine: string | null) => {
        set({
            searchMachine: machine,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null
        });
    },

    setPage: (page: number) => {
        set({ currentPage: page, error: null });
    },

    setNameBond: (bond: string | null) => {
        set({
            nameBond: bond,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null
        });
    },

    setGridSize: (size: string | null) => {
        set({
            gridSize: size,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null
        });
    },

    resetSearch: () => {
        set({
            searchCode: null,
            searchShape: null,
            searchDimensions: null,
            searchMachine: null,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null,
        });
    },

    resetFilters: () => {
        set({
            nameBond: null,
            gridSize: null,
            currentPage: 1,
            loadedPages: new Set(),
            items: [],
            error: null,
        });
    },

    setSearchAndResetPage: (newSearchFields) => {
        set(state => {
            const newState: Partial<CatalogState> = {
                currentPage: 1,
                loadedPages: new Set(),
                items: [],
                error: null
            };

            newState.searchCode = newSearchFields.code === '' ? null : newSearchFields.code ?? null;
            newState.searchShape = newSearchFields.shape === '' ? null : newSearchFields.shape ?? null;
            newState.searchDimensions = newSearchFields.dimensions === '' ? null : newSearchFields.dimensions ?? null;
            newState.searchMachine = newSearchFields.machine === '' ? null : newSearchFields.machine ?? null;

            const currentSearchCode = state.searchCode;
            const currentSearchShape = state.searchShape;
            const currentSearchDimensions = state.searchDimensions;
            const currentSearchMachine = state.searchMachine;

            const hasSearchChanged =
                currentSearchCode !== newState.searchCode ||
                currentSearchShape !== newState.searchShape ||
                currentSearchDimensions !== newState.searchDimensions ||
                currentSearchMachine !== newState.searchMachine;

            if (!hasSearchChanged) {
                return state;
            }

            return { ...state, ...newState };
        });
    },

    setFiltersAndResetPage: (newNameBond: string | null, newGridSize: string | null) => {
        set(state => {
            if (state.nameBond === newNameBond && state.gridSize === newGridSize) {
                return state;
            }

            return {
                ...state,
                nameBond: newNameBond,
                gridSize: newGridSize,
                currentPage: 1,
                loadedPages: new Set(),
                items: [],
            }
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
                newState.currentPage = 1
                newState.loadedPages = new Set()
                newState.items = []
            }
            return {...state, ...newState} as CatalogState;
        })
    }
}));