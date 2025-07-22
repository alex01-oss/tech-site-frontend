export interface CatalogItem {
    code: string;
    shape: string;
    dimensions: string;
    images: string;
    name_bond: string;
    grid_size: string;
    is_in_cart: boolean;
}

export interface CatalogResponse {
    items: CatalogItem[];
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
}

export interface SearchField {
    id: string;
    value: string;
    type: string;
}

export interface ProductDetailData {
    item: {
        code: string;
        shape: string;
        dimensions: string;
        images: string;
        name_bond: string;
        grid_size: string;
        is_in_cart: boolean;
    };
    bond: {
        name_bond: string;
        bond_description: string;
        bond_cooling: string;
    };
    machines: Array<{
        name_equipment: string;
        name_producer: string;
    }>;
}