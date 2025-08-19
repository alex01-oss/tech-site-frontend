import {Category, FiltersResponse} from "@/features/data/types";
import api from "@/lib/api";


export const dataApi = {
    getFilters: async (categoryId: number | null = null): Promise<FiltersResponse> => {
        const params = categoryId !== null ? {category_id: categoryId} : {};
        const res = await api.get("filters", {params});
        return res.data;
    },

    getCategories: async (): Promise<Category[]> => {
        const res = await api.get("categories");
        return res.data;
    }
};