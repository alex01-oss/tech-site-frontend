import {MenuResponse} from "@/features/menu/types";
import api from "@/shared/lib/api";


export const menuApi = {
    getMenu: async (): Promise<MenuResponse> => {
        const res = await api.get("menu");
        return res.data;
    }
};