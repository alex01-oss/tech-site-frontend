export interface SearchFields {
    code: string | null;
    shape: string | null;
    dimensions: string | null;
    machine: string | null;
}

export interface FilterFields {
    bondIds?: number[] | null;
    gridIds?: number[] | null;
    mountingIds?: number[] | null;
}