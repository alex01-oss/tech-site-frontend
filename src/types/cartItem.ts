import {CatalogItem} from "@/features/catalog/types";

export interface CartItem {
    product: CatalogItem;
    quantity: number;
}