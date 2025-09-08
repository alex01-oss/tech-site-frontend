"use client"

import { autoCompleteApi } from "@/features/autocomplete/api";
import { FilterFields, SearchFields } from "@/types/searchFields";

export const createEmptySearch = (): SearchFields => ({
    code: null,
    shape: null,
    dimensions: null,
    machine: null,
});

export const createEmptyFilters = (): FilterFields => ({
    bond_ids: null,
    grid_size_ids: null,
    mounting_ids: null,
});

export const hasActiveFilters = (obj: Record<string, any>): boolean => 
    Object.values(obj).some(value => 
        Array.isArray(value) ? value.length > 0 : !!value
    );

export const API_MAP = {
    code: autoCompleteApi.autocompleteCode,
    shape: autoCompleteApi.autocompleteShape,
    dimensions: autoCompleteApi.autocompleteDimensions,
    machine: autoCompleteApi.autocompleteMachine,
} as const;

export const getApiFieldName = (categoryTitle: string): keyof FilterFields => {
    const mapping = {
        'bonds': 'bond_ids',
        'grids': 'grid_size_ids', 
        'mountings': 'mounting_ids'
    } as const;
    return mapping[categoryTitle as keyof typeof mapping];
};