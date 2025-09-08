export interface SearchFields {
    code: string | null;
    shape: string | null;
    dimensions: string | null;
    machine: string | null;
}

export interface FilterFields {
    bond_ids?: number[] | null;
    grid_size_ids?: number[] | null;
    mounting_ids?: number[] | null;
}