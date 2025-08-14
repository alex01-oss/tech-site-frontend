import {create} from 'zustand';
import {LoginRequest, RegisterRequest, UpdateUserRequest, User} from './types';
import {usersApi} from "@/features/users/api";
import {authApi} from "@/features/auth/api";
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
    updateUser: (data: UpdateUserRequest) => Promise<boolean>;
    deleteUser: () => Promise<boolean>;
    logoutAll: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    (set, get) => ({
        user: null,
        isAuthenticated: false,
        initializing: true,
        loading: false,
        error: null,

        initialize: async () => {
            set({initializing: true, error: null});

            try {
                const user = await usersApi.getUser();
                set({
                    user,
                    isAuthenticated: true,
                    initializing: false,
                    error: null,
                });
                await useCartStore.getState().fetchCartCount();
            } catch (error: any) {
                console.warn("User fetch failed during initialization, attempting to refresh token.", error);

                if (error.response?.status === 401) {
                    try {
                        const refreshSuccess = await get().refresh();
                        if (refreshSuccess) {
                            const user = await usersApi.getUser();
                            set({
                                user,
                                isAuthenticated: true,
                                initializing: false,
                                error: null,
                            });
                        } else {
                            console.warn("Token refresh failed. Clearing authentication.");
                            get().clearAuth();
                            set({initializing: false});
                        }
                    } catch (refreshError) {
                        console.error("Failed to refresh token or fetch user after refresh:", refreshError);
                        get().clearAuth();
                        set({initializing: false});
                    }
                } else {
                    console.error("An error occurred during authentication initialization:", error);
                    get().clearAuth();
                    set({initializing: false});
                }
            }
        },

        login: async (data: LoginRequest) => {
            try {
                set({loading: true, error: null});
                await authApi.login(data);
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

        updateUser: async (data: UpdateUserRequest) => {
            set({loading: true, error: null});
            try {
                const updatedUser = await usersApi.updateUser(data);
                set({user: updatedUser, error: null});
                return true;
            } catch (error: any) {
                console.error("Update user failed:", error);
                set({
                    error: error.response?.data?.message || error.message || "Update user failed"
                });
                return false;
            } finally {
                set({loading: false});
            }
        },

        deleteUser: async () => {
            set({loading: true, error: null});
            try {
                await usersApi.deleteUser();
                get().clearAuth();
                useCartStore.getState().clearCart();
                return true;
            } catch (error: any) {
                console.error("Delete user failed:", error);
                set({
                    error: error.response?.data?.message || error.message || "Delete user failed"
                });
                return false;
            } finally {
                set({loading: false});
            }
        },

        logoutAll: async () => {
            set({loading: true, error: null});
            try {
                await authApi.logoutAllDevices();
            } catch (error: any) {
                console.error("Delete user failed:", error);
                set({
                    error: error.response?.data?.message || error.message || "Failed to log out all devices."
                });
            } finally {
                set({loading: false});
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
        }
    })
);