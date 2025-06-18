import {CartListResponse, CartRequest, CartResponse} from "@/features/cart/types";
import api from "@/shared/lib/api";


export const cartApi = {
    getCart: async (): Promise<CartListResponse> => {
        const res = await api.get("cart");
        return res.data;
    },

    addToCart: async (data: CartRequest): Promise<CartResponse> => {
        const res =  await api.post("cart/items", data);
        return res.data;
    },

    removeFromCart: async (code: string): Promise<CartResponse> => {
        const res = await api.delete(`cart/items/${code}`);
        return res.data;
    },

    getCartCount: async (): Promise<number> => {
        const red = await api.get("cart/count");
        return red.data;
    }
};