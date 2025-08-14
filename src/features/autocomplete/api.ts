import api from "@/lib/api";

const createAutocompleteFunction = (endpoint: string) => {
    return async (q: string, categoryId: number | null): Promise<string[]> => {
        try {
            const params = {
                q: q,
                ...(categoryId && { category_id: categoryId })
            };
            const res = await api.get<string[]>(`autocomplete/${endpoint}`, { params });
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