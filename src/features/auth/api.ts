import {AuthResponse, LoginRequest, RefreshResponse, RegisterRequest} from "@/features/auth/types";
import api from "@/shared/lib/api";

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await api.post("auth/login", data);
        return res.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const res = await api.post("auth/register", data);
        return res.data;
    },

    refresh: async (): Promise<RefreshResponse> => {
        const res = await api.post("auth/refresh");
        return res.data;
    },

    logout: async (): Promise<void> => {
        await api.post("auth/logout");
    },

    logoutAllDevices: async (): Promise<void> => {
        await api.post("auth/logout-all");
    },
};