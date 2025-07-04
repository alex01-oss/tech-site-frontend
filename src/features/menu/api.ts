import {MenuCategory} from "@/features/menu/types";
import api from "@/shared/lib/api";


export const menuApi = {
    getMenu: async (): Promise<MenuCategory[]> => {
        const res = await api.get("filters");
        return res.data;
    }
};