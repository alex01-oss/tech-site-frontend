import {cartApi} from "@/features/cart/api";
import {create} from "zustand";
import {CartItem} from "@/features/cart/types";

interface CartState {
    cart: CartItem[];
    cartIds: Set<number>;
    cartCount: number;
    loading: boolean;
    countLoading: boolean;
    error: string | null;

    fetchCart: () => Promise<void>;
    addToCart: (id: number) => Promise<boolean>;
    removeFromCart: (id: number) => Promise<boolean>;
    toggleCartItem: (id: number) => Promise<void>;
    fetchCartCount: () => Promise<void>;
    clearCart: () => void;
    isInCart: (id: number) => boolean;
}

export const useCartStore = create<CartState>()((set, get) => ({
    cart: [],
    cartIds: new Set(),
    cartCount: 0,
    loading: false,
    countLoading: false,
    error: null,

    fetchCart: async () => {
        if (get().loading) return;

        set({ loading: true, error: null });
        try {
            const response = await cartApi.getCart();
            const ids = new Set(response.cart.map(item => item.product.id));

            set({
                cart: response.cart,
                cartCount: response.cart.length,
                cartIds: ids,
                error: null,
            });
        } catch (e: any) {
            console.error("Fetching cart failed", e);
            set({ error: e.message || "Failed to fetch cart" });
        } finally {
            set({ loading: false });
        }
    },

    addToCart: async (id) => {
        const { cartIds } = get();

        if (cartIds.has(id)) return true

        set((state) => {
            const newCartIds = new Set(state.cartIds);
            newCartIds.add(id);
            return {
                cartIds: newCartIds,
                cartCount: state.cartCount + 1,
                error: null,
            };
        });

        try {
            await cartApi.addToCart(id);
            await get().fetchCartCount();
            return true;
        } catch (e: any) {
            console.error("Add to cart failed", e);
            set((state) => {
                const revertedIds = new Set(state.cartIds);
                revertedIds.delete(id);
                return {
                    cartIds: revertedIds,
                    cartCount: Math.max(0, state.cartCount - 1),
                    error: e.message || "Failed to add to cart",
                };
            });
            return false;
        }
    },

    removeFromCart: async (id) => {
        const { cartIds } = get();

        if (!cartIds.has(id)) return true

        set((state) => {
            const newCartIds = new Set(state.cartIds);
            newCartIds.delete(id);
            return {
                cartIds: newCartIds,
                cartCount: Math.max(0, state.cartCount - 1),
                error: null,
            };
        });

        try {
            await cartApi.removeFromCart(id);
            await get().fetchCartCount();
            set((state) => ({
                cart: state.cart.filter(item => item.product.id !== id),
            }));
            return true;
        } catch (e: any) {
            console.error("Remove from cart failed", e);
            set((state) => {
                const revertedCodes = new Set(state.cartIds);
                revertedCodes.add(id);
                return {
                    cartIds: revertedCodes,
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

    toggleCartItem: async (id) => {
        if (get().isInCart(id)) {
            await get().removeFromCart(id);
        } else {
            await get().addToCart(id);
        }
    },

    clearCart: () => {
        set({
            cart: [],
            cartIds: new Set(),
            cartCount: 0,
            error: null
        });
    },

    isInCart: (id) => get().cartIds.has(id)
}));