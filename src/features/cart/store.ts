import {cartApi} from "@/features/cart/api";
import {CatalogItem} from "@/features/catalog/types";
import {CartItem} from "@/types/cartItem";
import {create} from "zustand";

interface CartState {
    cart: CartItem[];
    cartCodes: Set<string>;
    cartCount: number;
    loading: boolean;
    error: string | null;

    fetchCart: () => Promise<void>;
    addToCart: (code: string) => Promise<boolean>;
    removeFromCart: (code: string) => Promise<boolean>;
    toggleCartItem: (item: CatalogItem) => Promise<void>;
    fetchCartCount: () => Promise<number>;
    clearCart: () => void;
    isInCart: (code: string) => boolean;
}

export const useCartStore = create<CartState>()((set, get) => ({
    cart: [],
    cartCodes: new Set(),
    cartCount: 0,
    loading: false,
    error: null,

    fetchCart: async () => {
        try {
            set({ loading: true });
            const response = await cartApi.getCart();
            const codes = new Set(response.cart.map(item => item.product.code));

            set({
                cart: response.cart,
                cartCodes: codes,
                cartCount: response.cart.length,
                error: null,
            });
        } catch (e) {
            console.error("Fetching cart failed", e);
            set({ error: "Failed to fetch cart" });
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (code) => {
        const { cartCodes, cartCount } = get();

        if (cartCodes.has(code)) {
            return true;
        }

        const newCartCodes = new Set(cartCodes);
        newCartCodes.add(code);
        set({
            cartCodes: newCartCodes,
            cartCount: cartCount + 1
        });

        try {
            await cartApi.addToCart({ code });
            return true;
        } catch (e) {
            console.error("Add to cart failed", e);
            const revertedCodes = new Set(cartCodes);
            set({
                cartCodes: revertedCodes,
                cartCount: cartCount
            });
            return false;
        }
    },

    removeFromCart: async (code) => {
        const { cartCodes, cartCount } = get();

        if (!cartCodes.has(code)) {
            return true;
        }

        const newCartCodes = new Set(cartCodes);
        newCartCodes.delete(code);
        set({
            cartCodes: newCartCodes,
            cartCount: Math.max(0, cartCount - 1)
        });

        try {
            await cartApi.removeFromCart(code);
            set((state) => ({
                cart: state.cart.filter(item => item.product.code !== code),
            }));
            return true;
        } catch (e) {
            console.error("Remove from cart failed", e);
            const revertedCodes = new Set(cartCodes);
            revertedCodes.add(code);
            set({
                cartCodes: revertedCodes,
                cartCount: cartCount
            });
            return false;
        }
    },

    fetchCartCount: async () => {
        try {
            const count = await cartApi.getCartCount();
            set({ cartCount: count });
            return count;
        } catch (error) {
            console.error("Fetch cart count failed:", error);
            return get().cartCount;
        }
    },

    toggleCartItem: async (item) => {
        if (get().isInCart(item.code)) {
            await get().removeFromCart(item.code);
        } else {
            await get().addToCart(item.code);
        }
    },

    clearCart: () => {
        set({
            cart: [],
            cartCodes: new Set(),
            cartCount: 0,
            error: null
        });
    },

    isInCart: (code) => {
        return get().cartCodes.has(code);
    }
}))