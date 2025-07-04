import {CatalogResponse} from "./types";
import api from "@/shared/lib/api";

export const fetchCatalog = async (
    params: {
        search: string | undefined;
        search_type: string;
        page: number;
        items_per_page: number;
        name_bond: string | undefined;
        grid_size: string | undefined
    }
): Promise<CatalogResponse> => {
    const res = await api.get('catalog', { params });
    return res.data
};