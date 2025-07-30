import api from "@/shared/lib/api";

export const autoCompleteApi = {
    autocompleteCode: async (q: string): Promise<string[]> => {
        try {
            const res = await api.get<string[]>(`autocomplete/code`, { params: { q } })
            return res.data
        } catch (e) {
            console.error("Error fetching autocomplete code:", e);
            return []
        }
    },

    autocompleteShape: async (q: string): Promise<string[]> => {
        try {
            const res = await api.get<string[]>(`autocomplete/shape`, { params: { q } })
            return res.data
        } catch (e) {
            console.error("Error fetching autocomplete shape:", e);
            return []
        }
    },

    autocompleteDimensions: async (q: string): Promise<string[]> => {
        try {
            const res = await api.get<string[]>(`autocomplete/dimensions`, { params: { q } })
            return res.data
        } catch (e) {
            console.error("Error fetching autocomplete dimensions:", e);
            return []
        }
    },

    autocompleteMachine: async (q: string): Promise<string[]> => {
        try {
            const res = await api.get<string[]>(`autocomplete/machine`, { params: { q } })
            return res.data
        } catch (e) {
            console.error("Error fetching autocomplete machine:", e);
            return []
        }
    },
}