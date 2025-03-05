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

const safeLocalStorage = {
  getItem: (key: string, defaultValue: string = '[]') => {
    if (typeof window === 'undefined') return defaultValue;
    return localStorage.getItem(key) || defaultValue;
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
};

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  token: null,
  signed: false,
  isOpen: false,
  cart: [],
  selectedProducts: JSON.parse(safeLocalStorage.getItem("selectedProducts")),

  checkAuth: () => {
    const user = safeLocalStorage.getItem("user", 'null');
    const token = safeLocalStorage.getItem("accessToken", 'null');
    
    set({ 
      signed: user !== 'null' && token !== 'null', 
      user: user !== 'null' ? JSON.parse(user) : null,
      token: token !== 'null' ? token : null
    });
  },

  login: (user, token) => {
    safeLocalStorage.setItem("user", JSON.stringify(user));
    safeLocalStorage.setItem("accessToken", token);
    
    set({ user, token, signed: true });
  },

  logout: () => {
    safeLocalStorage.removeItem("user");
    safeLocalStorage.removeItem("accessToken");
    
    set({ user: null, token: null, signed: false, cart: [] });
  },

  setOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    try {
      const response = await fetchData("cart", "GET");
      set({ cart: response.cart });
    } catch (error: any) {
      if (error.status === 401) {
        try {
          await get().refreshToken();
          const response = await fetchData("cart", "GET");
          set({ cart: response.cart });
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          get().logout();
        }
      } else {
        console.error("Failed to fetch cart", error);
      }
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = safeLocalStorage.getItem("refreshToken");
      
      if (!refreshToken || refreshToken === 'null') {
        get().logout();
        return;
      }

      const response = await fetchData("auth/refresh", "POST", { refreshToken });

      if (response.accessToken) {
        safeLocalStorage.setItem("accessToken", response.accessToken);
        set({ token: response.accessToken });
      } else {
        get().logout();
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
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
      });
      
      set((state) => ({ cart: [...state.cart, product] }));
    } catch (error: any) {
      if (error.status === 401) {
        await get().refreshToken();
        await get().addToCart(product);
      } else {
        console.error("Failed to add to cart", error);
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
        await get().removeFromCart(article);
      } else {
        console.error("Failed to remove from cart", error);
      }
    }
  },

  toggleProductSelection: (article) => {
    set((state) => {
      const newSelectedProducts = state.selectedProducts.includes(article)
        ? state.selectedProducts.filter((id) => id !== article)
        : [...state.selectedProducts, article];

      safeLocalStorage.setItem("selectedProducts", JSON.stringify(newSelectedProducts));

      return { selectedProducts: newSelectedProducts };
    });
  },
}));