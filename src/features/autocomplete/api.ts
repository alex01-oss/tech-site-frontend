import api from "@/lib/api";

interface AutocompleteParams {
    q: string;
    category_id: number | null;
    search_code?: string;
    search_shape?: string;
    search_dimensions?: string;
    search_machine?: string;
    bond_ids?: number[];
    grid_size_ids?: number[];
    mounting_ids?: number[];
}

const createAutocompleteFunction = (endpoint: string) => {
    return async (params: AutocompleteParams): Promise<string[]> => {
        try {
            const res = await api.get(`autocomplete/${endpoint}`, {
                    params,
                    paramsSerializer: {
                        indexes: null
                    }
                });
            return res.data;
        } catch (e) {
            console.error(`Error fetching autocomplete ${endpoint}:`, e);
            return [];
        }
    };
};

export const autoCompleteApi = {
    autocompleteCode: createAutocompleteFunction('code'),
    autocompleteShape: createAutocompleteFunction('shape'),
    autocompleteDimensions: createAutocompleteFunction('dimensions'),
    autocompleteMachine: createAutocompleteFunction('machine'),
};