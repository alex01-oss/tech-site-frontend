import {authApi} from "@/features/auth/api";
import {RegisterRequest} from "@/features/auth/types";
import {usersApi} from "@/features/users/api";
import {persist} from "zustand/middleware";
import {create} from "zustand";
import {useCartStore} from "@/features/cart/store";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    initializing: boolean;
    loading: boolean;
    error: string | null;

    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: RegisterRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    refresh: () => Promise<boolean>;
    clearAuth: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            initializing: true,
            loading: false,
            error: null,

            initialize: async () => {
                try {
                    set({ initializing: true, error: null });

                    const { accessToken, refreshToken } = get();

                    if (!accessToken && !refreshToken) {
                        set({
                            isAuthenticated: false,
                            initializing: false
                        });
                        return;
                    }

                    try {
                        const user: User = await usersApi.getUser();
                        console.log("user", user);
                        set({
                            user,
                            isAuthenticated: true,
                            initializing: false
                        });
                    } catch (error: any) {
                        if (error.response?.status === 401 && refreshToken) {
                            const refreshSuccess = await get().refresh();

                            if (refreshSuccess) {
                                try {
                                    const user: User = await usersApi.getUser();
                                    set({
                                        user,
                                        isAuthenticated: true,
                                        initializing: false
                                    });
                                } catch {
                                    get().clearAuth();
                                    set({ initializing: false });
                                }
                            } else {
                                get().clearAuth();
                                set({ initializing: false });
                            }
                        } else {
                            get().clearAuth();
                            set({ initializing: false });
                        }
                    }
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    get().clearAuth();
                    set({ initializing: false });
                }
            },

            login: async (email: string, password: string) => {
                try {
                    set({ loading: true, error: null });

                    const response = await authApi.login({ email, password });

                    set({
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                    });

                    try {
                        const user: User = await usersApi.getUser();
                        set({ user });
                    } catch (error) {
                        console.warn("Failed to fetch user after login:", error);
                    }

                    return true;
                } catch (error: any) {
                    console.error("Login failed:", error);
                    set({
                        error: error.response?.data?.message || error.message || "Login failed"
                    });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            register: async (data: RegisterRequest) => {
                try {
                    set({ loading: true, error: null });

                    const response = await authApi.register(data);

                    set({
                        user: response.user,
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                    });

                    return true;
                } catch (error: any) {
                    console.error("Registration failed:", error);
                    set({
                        error: error.response?.data?.message || error.message || "Registration failed"
                    });
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            refresh: async () => {
                try {
                    const { refreshToken } = get();

                    if (!refreshToken) {
                        console.warn("No refresh token available");
                        return false;
                    }

                    const response = await authApi.refresh({ refresh_token: refreshToken });

                    set({
                        accessToken: response.access_token,
                        refreshToken: response.refresh_token,
                        isAuthenticated: true,
                    });

                    return true;
                } catch (error: any) {
                    console.error("Token refresh failed:", error);
                    return false;
                }
            },

            logout: async () => {
                try {
                    const { refreshToken } = get();

                    if (refreshToken) {
                        await authApi.logout({ refresh_token: refreshToken });
                    }
                } catch (error) {
                    console.warn("Logout request failed:", error);
                } finally {
                    get().clearAuth();
                    useCartStore.getState().clearCart();
                }
            },
            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: "auth-store",
            partialize: (state): Partial<AuthState> => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);