import {CatalogResponse, ProductDetailData} from "./types";
import api from "@/shared/lib/api";

export const catalogApi = {
    fetchCatalog: async (
        params: {
            search_code: string | undefined;
            search_shape: string | undefined;
            search_dimensions: string | undefined;
            search_machine: string | undefined;
            page: number;
            items_per_page: number;
            bond_ids: number[] | undefined;
            grid_size_ids: number[] | undefined
        }
    ): Promise<CatalogResponse> => {
        const res = await api.get('catalog', {
            params,
            paramsSerializer: {
                indexes: null
            }
        });
        return res.data
    },

    fetchCatalogItem: async (
        code: string
    ): Promise<ProductDetailData> => {
        const res = await api.get(`catalog/${code}`);
        return res.data;
    }
}