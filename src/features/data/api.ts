import {Category, FilterResponse} from "@/features/data/types";
import api from "@/shared/lib/api";


export const menuApi = {
    getFilters: async (): Promise<FilterResponse> => {
        const res = await api.get("filters");
        return res.data;
    },

    getCategories: async (): Promise<Category[]> => {
        const res = await api.get("categories");
        return res.data;
    }
};