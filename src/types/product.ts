import {CatalogItem} from "@/features/catalog/types";

interface Bond {
    name_bond: string;
    bond_description: string;
    bond_cooling: string;
}

interface Machine {
    name_equipment: string;
    name_producer: string;
}

interface Catalog {
    items: CatalogItem[];
    total_items: number;
    total_pages: number;
    current_page: number;
    items_per_page: number;
}