import { create } from "zustand";
import { fetchData } from "../api/service";

interface User {
  email: string;
  username?: string;
}

interface CartWoodItem {
  code: string;
  shape: string;
  dimensions: string;
  images: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  tokenExpiration: number | null;
  signed: boolean;
  isOpen: boolean;
  cart: CartWoodItem[];
  selectedProducts: string[];
  isInitialized: boolean;
  isCartLoading: boolean;
  tokenRefreshTimer: NodeJS.Timeout | null;
  
  initialize: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setOpen: (isOpen: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (product: CartWoodItem) => Promise<boolean>;
  removeFromCart: (code: string) => Promise<boolean>;
  toggleProductSelection: (code: string) => void;
  refreshToken: () => Promise<boolean>;
  clearTokenRefreshTimer: () => void;
  setupTokenRefresh: () => void;
}

const safeLocalStorage = {
  getItem: (key: string, defaultValue: string = '') => {
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

const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return jsonString ? JSON.parse(jsonString) : fallback;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    return fallback;
  }
};

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  token: null,
  tokenExpiration: null,
  signed: false,
  isOpen: false,
  cart: [],
  selectedProducts: safeJsonParse(safeLocalStorage.getItem("selectedProducts"), []),
  isInitialized: false,
  isCartLoading: false,
  tokenRefreshTimer: null,

  initialize: async () => {
    try {
      const isAuthenticated = await get().checkAuth();
      
      if (isAuthenticated) {
        get().setupTokenRefresh();
        await get().fetchCart();
      }
      
      set({ isInitialized: true });
    } catch (error) {
      console.error("Initialization failed:", error);
      set({ isInitialized: true });
    }
  },

  clearTokenRefreshTimer: () => {
    const { tokenRefreshTimer } = get();
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      set({ tokenRefreshTimer: null });
    }
  },

  setupTokenRefresh: () => {
    get().clearTokenRefreshTimer();
    
    const tokenExpiration = get().tokenExpiration;
    if (!tokenExpiration) return;
    
    const currentTime = Date.now();
    const timeUntilExpiration = tokenExpiration - currentTime;
    
    const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0);
    
    if (refreshTime > 0) {
      const timer = setTimeout(async () => {
        const success = await get().refreshToken();
        if (success) {
          get().setupTokenRefresh();
        }
      }, refreshTime);
      
      set({ tokenRefreshTimer: timer as unknown as NodeJS.Timeout });
    }
  },

  checkAuth: async () => {
    try {
      const userStr = safeLocalStorage.getItem("user");
      const token = safeLocalStorage.getItem("accessToken");
      const refreshToken = safeLocalStorage.getItem("refreshToken");
      const tokenExpirationStr = safeLocalStorage.getItem("tokenExpiration");
      
      const user = safeJsonParse<User | null>(userStr, null);
      const tokenExpiration = tokenExpirationStr ? parseInt(tokenExpirationStr) : 0;
      
      const hasCredentials = user && token && refreshToken;
      if (!hasCredentials) {
        set({ signed: false, user: null, token: null, tokenExpiration: null });
        return false;
      }
      
      const currentTime = Date.now();
      if (tokenExpiration && tokenExpiration > currentTime + 60 * 1000) {
        set({ signed: true, user, token, tokenExpiration });
        return true;
      }
      
      const refreshSuccess = await get().refreshToken();
      return refreshSuccess;
    } catch (error) {
      console.error("Auth check failed:", error);
      get().logout();
      return false;
    }
  },

  login: (user, token, refreshToken) => {
    try {
      const expirationTime = Date.now() + 3600 * 1000; // 1 година
      
      safeLocalStorage.setItem("user", JSON.stringify(user));
      safeLocalStorage.setItem("accessToken", token);
      safeLocalStorage.setItem("refreshToken", refreshToken);
      safeLocalStorage.setItem("tokenExpiration", expirationTime.toString());
      
      set({ 
        user, 
        token, 
        signed: true,
        tokenExpiration: expirationTime
      });

      get().setupTokenRefresh();
      get().fetchCart();
    } catch (error) {
      console.error("Login failed:", error);
    }
  },

  logout: () => {
    get().clearTokenRefreshTimer();
    
    safeLocalStorage.removeItem("user");
    safeLocalStorage.removeItem("accessToken");
    safeLocalStorage.removeItem("refreshToken");
    safeLocalStorage.removeItem("tokenExpiration");
    
    set({ 
      user: null, 
      token: null, 
      tokenExpiration: null, 
      signed: false, 
      cart: [] 
    });
  },

  setOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    const { token, signed } = get();
    if (!signed || !token) {
      return;
    }

    set({ isCartLoading: true });

    try {
      const response = await fetchData("cart", "GET");
      set({ cart: response.cart || [], isCartLoading: false });
    } catch (error: any) {
      set({ isCartLoading: false });
      
      if (error.status === 401) {
        const refreshSuccessful = await get().refreshToken();
        if (refreshSuccessful) {
          await get().fetchCart();
        }
      } else {
        console.error("Failed to fetch cart:", error.message || 'Unknown error');
      }
    }
  },

  refreshToken: async () => {
    try {
      const refreshToken = safeLocalStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        get().logout();
        return false;
      }

      const response = await fetchData("auth/refresh", "POST", { refreshToken });

      if (response && response.accessToken) {
        const expirationTime = Date.now() + 3600 * 1000;
        
        safeLocalStorage.setItem("accessToken", response.accessToken);
        safeLocalStorage.setItem("tokenExpiration", expirationTime.toString());
        
        set({ 
          token: response.accessToken,
          tokenExpiration: expirationTime,
          signed: true
        });
        
        return true;
      } else {
        get().logout();
        return false;
      }
    } catch (error: any) {
      console.error("Token refresh failed:", error.message || 'Unknown error');
      get().logout();
      return false;
    }
  },

  addToCart: async (product) => {
    if (!get().signed) {
      console.error("Cannot add to cart: User not authenticated");
      return false;
    }
    
    try {
      await fetchData("cart", "POST", {
        code: product.code,
        shape: product.shape,
        dimensions: product.dimensions,
        images: product.images
      });
      
      set((state) => ({ 
        cart: [...state.cart.filter(item => item.code !== product.code), product] 
      }));
      
      return true;
    } catch (error: any) {
      if (error.status === 401) {
        const refreshSuccessful = await get().refreshToken();
        if (refreshSuccessful) {
          return await get().addToCart(product);
        }
      } else if (error.status === 404) {
        console.error("Product not found or API endpoint missing");
      } else if (error.status === 400) {
        console.error("Invalid product data:", error.message);
      } else {
        console.error("Failed to add to cart:", error.message || 'Unknown error');
      }
      
      return false;
    }
  },
  
  removeFromCart: async (code) => {
    if (!get().signed) {
      return false;
    }
    
    try {
      await fetchData("cart", "DELETE", { code });

      set((state) => ({
        cart: state.cart.filter((item) => item.code !== code),
      }));
      
      return true;
    } catch (error: any) {
      if (error.status === 401) {
        const refreshSuccessful = await get().refreshToken();
        if (refreshSuccessful) {
          return await get().removeFromCart(code);
        }
      } else if (error.status === 404) {
        console.error("Item not found in cart");
        set((state) => ({
          cart: state.cart.filter((item) => item.code !== code),
        }));
        return true;
      } else {
        console.error("Failed to remove from cart:", error.message || 'Unknown error');
      }
      
      return false;
    }
  },

  toggleProductSelection: (code) => {
    set((state) => {
      const newSelectedProducts = state.selectedProducts.includes(code)
        ? state.selectedProducts.filter((id) => id !== code)
        : [...state.selectedProducts, code];
      
      safeLocalStorage.setItem("selectedProducts", JSON.stringify(newSelectedProducts));
      return { selectedProducts: newSelectedProducts };
    });
  },
}));