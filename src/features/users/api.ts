import api from "@/shared/lib/api";
import {UpdateUserRequest, User} from "@/features/auth/types";

export const usersApi = {
    getUser: async (): Promise<User> => {
        const res = await api.get("user");
        return res.data.user;
    },

    updateUser: async (data: UpdateUserRequest): Promise<User> => {
        const res = await api.patch<User>("user", data);
        return res.data;
    },

    deleteUser: async (): Promise<void> => {
        await api.delete("user");
    }
}