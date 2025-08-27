export interface Product {
    id: number;
    code: string;
    shape: string;
    dimensions: string;
    images: string;
    name_bonds: string[];
    grid_size: string;
    mounting?: MountingDetail
    is_in_cart: boolean;
}

export interface CatalogResponse {
    items: Product[];
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
    category_name?: string;
}

export interface BondDetail {
    name_bond: string;
    bond_description: string;
    bond_cooling: string;
}

export interface MachineDetail {
    model: string;
    name_producer: string;
}

export interface MountingDetail {
    mm: string;
    inch: string;
}

export interface ProductDetailData {
    item: {
        id: number;
        code: string;
        shape: string;
        dimensions: string;
        images: string;
        name_bonds: string[];
        grid_size: string;
        mounting?: MountingDetail
        is_in_cart: boolean;
    };
    bonds: BondDetail[];
    machines: MachineDetail[];
    mounting: MountingDetail;
}