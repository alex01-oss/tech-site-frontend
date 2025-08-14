import {CartListResponse, CartResponse} from "@/features/cart/types";
import api from "@/shared/lib/api";


export const cartApi = {
    getCart: async (): Promise<CartListResponse> => {
        const res = await api.get("cart");
        return res.data;
    },

    addToCart: async (id: number): Promise<CartResponse> => {
        const res =  await api.post("cart/items", { product_id: id });
        return res.data;
    },

    removeFromCart: async (id: number): Promise<CartResponse> => {
        const res = await api.delete(`cart/items/${id}`);
        return res.data;
    },

    getCartCount: async (): Promise<number> => {
        const red = await api.get("cart/count");
        return red.data;
    }
};