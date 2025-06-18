interface User {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    role: "admin" | "user" | string;
}