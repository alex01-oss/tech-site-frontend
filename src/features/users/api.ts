import {UserResponse} from "@/features/users/types";
import api from "@/shared/lib/api";

export const usersApi = {
    getUser: async (): Promise<UserResponse> => {
        const res = await api.get("user");
        return res.data;
    }
}