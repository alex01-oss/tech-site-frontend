import api from "@/shared/lib/api";

export const usersApi = {
    getUser: async (): Promise<User> => {
        const res = await api.get("user");
        return res.data.user;
    }
}