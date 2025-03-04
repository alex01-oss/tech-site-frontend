import { create } from "zustand";
import { fetchData } from "../api/service";

interface User {
  id: number;
  email: string;
  name: string;
}

interface CartItem {
  article: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  // images: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  signed: boolean;
  isOpen: boolean;
  cart: CartItem[];
  selectedProducts: string[];
  
  checkAuth: () => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setOpen: (isOpen: boolean) => void;
  
  fetchCart: () => Promise<void>;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (article: string) => Promise<void>;

  toggleProductSelection: (article: string) => void;
  refreshToken: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  token: null,
  signed: false,
  isOpen: false,
  cart: [],
  selectedProducts: JSON.parse(localStorage.getItem("selectedProducts") || "[]"),

  checkAuth: () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    set({ 
      signed: !!user && !!token, 
      user: user ? JSON.parse(user) : null,
      token: token || null
    });
  },

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", token);
    set({ user, token, signed: true });
  },

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    set({ user: null, token: null, signed: false, cart: [] });
  },

  setOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    try {
      const response = await fetchData("cart", "GET");
      set({ cart: response.cart });
    } catch (error: any) {
      if (error.status === 401) {
        await get().refreshToken();
        await get().fetchCart();
      } else {
        console.error("failed to fetch cart", error);
      }
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        get().logout();
        return;
      }

      const response = await fetchData("auth/refresh", "POST", { refreshToken });
      
      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        set({ token: response.accessToken });
      } else {
        get().logout();
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      get().logout();
    }
  },

  addToCart: async (product) => {
    try {
      await fetchData("cart", "POST", {
        article: product.article,
        title: product.title,
        price: product.price,
        currency: product.currency,
        // images: product.images
      });
      set((state) => ({ cart: [...state.cart, product] }));
    } catch (error: any) {
      if (error.status === 401) {
        await get().refreshToken();
        await get().addToCart(product);
      } else {
        console.error("failed to add to cart", error);
      }
    }
  },

  removeFromCart: async (article) => {
    try {
      await fetchData("cart", "DELETE", { article });
      set((state) => ({
        cart: state.cart.filter((item) => item.article !== article),
      }));
    } catch (error: any) {
      if (error.status === 401) {
        await get().refreshToken();
        // Retry removing from cart
        await get().removeFromCart(article);
      } else {
        console.error("failed to remove from cart", error);
      }
    }
  },

  toggleProductSelection: (article) => {
    set((state) => {
      const newSelectedProducts = state.selectedProducts.includes(article)
        ? state.selectedProducts.filter((id) => id !== article)
        : [...state.selectedProducts, article];

      localStorage.setItem("selectedProducts", JSON.stringify(newSelectedProducts));

      return { selectedProducts: newSelectedProducts };
    });
  },
}));