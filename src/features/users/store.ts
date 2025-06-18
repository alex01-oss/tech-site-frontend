import { create } from "zustand";
import { persist } from "zustand/middleware";
import { usersApi } from "./api";
import { useAuthStore } from "../auth/store";

interface UsersState {
    user: User | null;
    loading: boolean;
    error: string | null;

    getUser: () => Promise<void>;
    clearUser: () => void;
    setUser: (user: User | null) => void;
}

export const useUsersStore = create<UsersState>()(
    persist(
        (set, get) => ({
            user: null,
            loading: false,
            error: null,

            getUser: async () => {
                try {
                    set({ loading: true, error: null });

                    const response = await usersApi.getUser();
                    set({ user: response.user });
                } catch (e) {
                    console.error("Get user failed", e);
                    set({ error: e instanceof Error ? e.message : "Failed to get user" });

                    useAuthStore.getState().clearAuth();
                } finally {
                    set({ loading: false });
                }
            },

            clearUser: () => {
                set({ user: null, error: null });
            },

            setUser: (user) => {
                set({ user, error: null });
            },
        }),
        {
            name: "users-store",
            partialize: (state) => ({
                user: state.user,
            })
        }
    )
);