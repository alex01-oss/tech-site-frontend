import {CartItem} from "@/types/cartItem";

export interface CartListResponse {
    cart: CartItem[];
}

export interface CartResponse {
    message: string;
}