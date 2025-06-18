import {CatalogResponse} from "./types";
import api from "@/shared/lib/api";

export const fetchCatalog = async (
    params: {
        search?: string;
        search_type?: string;
        page?: number;
    }
): Promise<CatalogResponse> => {
    const res = await api.get('catalog', { params });
    return res.data
};