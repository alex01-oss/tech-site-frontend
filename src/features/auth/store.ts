import {authApi} from "@/features/auth/api";
import {LoginRequest, RegisterRequest, User} from "@/features/auth/types";
import {usersApi} from "@/features/users/api";
import {persist} from "zustand/middleware";
import {create} from "zustand";
import {useCartStore} from "@/features/cart/store";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    initializing: boolean;
    loading: boolean;
    error: string | null;

    initialize: () => Promise<void>;
    login: (data: LoginRequest) => Promise<boolean>;
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
            isAuthenticated: false,
            initializing: true,
            loading: false,
            error: null,

            initialize: async () => {
                try {
                    set({initializing: true, error: null});

                    try {
                        const user: User = await usersApi.getUser();
                        console.log("user", user);
                        set({
                            user,
                            isAuthenticated: true,
                            initializing: false
                        });
                    } catch (error: any) {
                        console.warn("User fetch failed during initialization, attempting refresh:", error);
                        if (error.response?.status === 401) {
                            const refreshSuccess = await get().refresh();

                            if (refreshSuccess) {
                                try {
                                    const user: User = await usersApi.getUser();
                                    set({
                                        user,
                                        isAuthenticated: true,
                                        initializing: false
                                    });
                                } catch (retryError) {
                                    console.error("Failed to fetch user after refresh retry:", retryError);
                                    get().clearAuth();
                                    set({initializing: false});
                                }
                            } else {
                                console.warn("Refresh failed, clearing auth.");
                                get().clearAuth();
                                set({initializing: false});
                            }
                        } else {
                            console.error("Non-401 error during user fetch initialization:", error);
                            get().clearAuth();
                            set({initializing: false});
                        }
                    }
                } catch (error) {
                    console.error("Auth initialization failed:", error);
                    get().clearAuth();
                    set({initializing: false});
                }
            },

            login: async (data: LoginRequest) => {
                try {
                    set({loading: true, error: null});
                    await authApi.login(data);
                    set({isAuthenticated: true});

                    await get().initialize();
                    return true;
                } catch (error: any) {
                    console.error("Login failed:", error);
                    set({
                        error: error.response?.data?.message || error.message || "Login failed"
                    });
                    return false;
                } finally {
                    set({loading: false});
                }
            },

            register: async (data: RegisterRequest) => {
                try {
                    set({loading: true, error: null});
                    await authApi.register(data);
                    set({isAuthenticated: true});

                    await get().initialize();
                    return true;
                } catch (error: any) {
                    console.error("Registration failed:", error);
                    set({
                        error: error.response?.data?.message || error.message || "Registration failed"
                    });
                    return false;
                } finally {
                    set({loading: false});
                }
            },

            refresh: async () => {
                try {
                    await authApi.refresh();
                    set({isAuthenticated: true});
                    return true;
                } catch (error: any) {
                    console.error("Token refresh failed:", error);
                    get().clearAuth();
                    return false;
                }
            },

            logout: async () => {
                try {
                    await authApi.logout();
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
                    isAuthenticated: false,
                    error: null,
                });
            },

            clearError: () => {
                set({error: null});
            },

        }),
        {name: "auth-store"}
    )
);