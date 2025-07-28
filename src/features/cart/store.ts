import { cartApi } from "@/features/cart/api";
import { CatalogItem } from "@/features/catalog/types";
import { CartItem } from "@/types/cartItem";
import { create } from "zustand";

interface CartState {
    cart: CartItem[];
    cartCodes: Set<string>;
    cartCount: number;
    loading: boolean;
    countLoading: boolean;
    error: string | null;

    fetchCart: () => Promise<void>;
    addToCart: (code: string) => Promise<boolean>;
    removeFromCart: (code: string) => Promise<boolean>;
    toggleCartItem: (item: CatalogItem) => Promise<void>;
    fetchCartCount: () => Promise<void>;
    clearCart: () => void;
    isInCart: (code: string) => boolean;
}

export const useCartStore = create<CartState>()((set, get) => ({
    cart: [],
    cartCodes: new Set(),
    cartCount: 0,
    loading: false,
    countLoading: false,
    error: null,

    fetchCart: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });
        try {
            const response = await cartApi.getCart();
            const codes = new Set(response.cart.map(item => item.product.code));

            set({
                cart: response.cart,
                cartCodes: codes,
                cartCount: response.cart.length,
                error: null,
            });
        } catch (e: any) {
            console.error("Fetching cart failed", e);
            set({ error: e.message || "Failed to fetch cart" });
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (code) => {
        const { cartCodes } = get();

        if (cartCodes.has(code)) {
            return true;
        }

        set((state) => {
            const newCartCodes = new Set(state.cartCodes);
            newCartCodes.add(code);
            return {
                cartCodes: newCartCodes,
                cartCount: state.cartCount + 1,
                error: null,
            };
        });

        try {
            await cartApi.addToCart({ code });
            await get().fetchCartCount();
            return true;
        } catch (e: any) {
            console.error("Add to cart failed", e);
            set((state) => {
                const revertedCodes = new Set(state.cartCodes);
                revertedCodes.delete(code);
                return {
                    cartCodes: revertedCodes,
                    cartCount: Math.max(0, state.cartCount - 1),
                    error: e.message || "Failed to add to cart",
                };
            });
            return false;
        }
    },

    removeFromCart: async (code) => {
        const { cartCodes } = get();

        if (!cartCodes.has(code)) {
            return true;
        }

        set((state) => {
            const newCartCodes = new Set(state.cartCodes);
            newCartCodes.delete(code);
            return {
                cartCodes: newCartCodes,
                cartCount: Math.max(0, state.cartCount - 1),
                error: null,
            };
        });

        try {
            await cartApi.removeFromCart(code);
            await get().fetchCartCount();
            set((state) => ({
                cart: state.cart.filter(item => item.product.code !== code),
            }));
            return true;
        } catch (e: any) {
            console.error("Remove from cart failed", e);
            set((state) => {
                const revertedCodes = new Set(state.cartCodes);
                revertedCodes.add(code);
                return {
                    cartCodes: revertedCodes,
                    cartCount: state.cartCount + 1,
                    error: e.message || "Failed to remove from cart",
                };
            });
            return false;
        }
    },

    fetchCartCount: async () => {
        if (get().countLoading) return;

        set({ countLoading: true, error: null });
        try {
            const count = await cartApi.getCartCount();
            set({ cartCount: count, error: null });
        } catch (error: any) {
            console.error("Fetch cart count failed:", error);
            set({ error: error.message || "Failed to fetch cart count" });
        } finally {
            set({ countLoading: false });
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
}));