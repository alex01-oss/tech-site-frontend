import {CatalogItem} from "@/features/catalog/types";

export interface CartListResponse {
    cart: CartItem[];
}

export interface CartResponse {
    message: string;
}

export interface CartItem {
    product: CatalogItem;
    quantity: number;
}