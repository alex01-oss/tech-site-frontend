import axios from "axios";
import {useAuthStore} from "@/features/auth/store";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                }).then((token) => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    }
                    return Promise.reject(error);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
                const refreshSuccess = await useAuthStore.getState().refresh();

                if (refreshSuccess) {
                    processQueue(null, null);
                    return api(originalRequest);
                } else {
                    const refreshError = new Error("Refresh failed: Token invalid or expired.");
                    processQueue(refreshError);
                    useAuthStore.getState().clearAuth();
                    return Promise.reject(refreshError);
                }
            } catch (refreshError) {
                processQueue(refreshError);
                useAuthStore.getState().clearAuth();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;