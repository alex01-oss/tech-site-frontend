import { create } from "zustand";
import { persist } from "zustand/middleware";
import { menuApi } from "@/features/menu/api";
import { MenuCategory } from "@/features/menu/types";

interface MenuState {
    menu: MenuCategory[];
    loading: boolean;
    error: string | null;
    isOpen: boolean;
    hasFetched: boolean;

    fetchMenu: () => Promise<void>;
    clearMenu: () => void;
    toggleOpen: () => void;
}

export const useMenuStore = create<MenuState>()(
    persist(
        (set, get) => ({
            menu: [],
            loading: false,
            error: null,
            isOpen: false,
            hasFetched: false,

            fetchMenu: async () => {
                const { hasFetched } = get();
                if (hasFetched) return;

                try {
                    set({ loading: true, error: null });
                    const response = await menuApi.getMenu();
                    set({
                        menu: response.categories,
                        hasFetched: true,
                    });
                } catch (e) {
                    console.error("Fetch menu failed", e);
                    set({ error: e instanceof Error ? e.message : "Failed to fetch menu" });
                } finally {
                    set({ loading: false });
                }
            },

            clearMenu: () => {
                set({ menu: [], error: null, hasFetched: false });
            },

            toggleOpen: () => {
                set((state) => ({ isOpen: !state.isOpen }));
            },
        }),
        {
            name: "menu-store",
            partialize: (state) => ({
                menu: state.menu,
                hasFetched: state.hasFetched,
            }),
        }
    )
);