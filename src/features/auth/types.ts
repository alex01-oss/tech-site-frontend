export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    full_name: string;
    email: string;
    phone: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface RefreshRequest {
    refresh_token: string;
}

export interface RefreshResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LogoutRequest {
    refresh_token: string;
}

export interface User {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    role: "admin" | "user" | string;
}