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
  cart: CartWoodItem[]
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
  addToCart: (product: CartWoodItem) => Promise<void>;
  removeFromCart: (code: string) => Promise<void>;
  toggleProductSelection: (code: string) => void;
  refreshToken: () => Promise<boolean>;
  setupTokenRefresh: () => void;
  clearTokenRefreshTimer: () => void;
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

const safeJsonParse = (jsonString: string, fallback: any = []) => {
  try {
    return JSON.parse(jsonString);
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
    const isAuthenticated = await get().checkAuth();
    
    if (isAuthenticated) {
      get().setupTokenRefresh();
      await get().fetchCart();
    }
    
    set({ isInitialized: true });
  },

  setupTokenRefresh: () => {
    get().clearTokenRefreshTimer();
    
    const tokenExpiration = get().tokenExpiration;
    if (!tokenExpiration) return;
    
    const currentTime = Date.now();
    const timeUntilExpiration = tokenExpiration - currentTime;
    
    // Оновлюємо токен за 5 хвилин до закінчення терміну дії
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
  
  clearTokenRefreshTimer: () => {
    const { tokenRefreshTimer } = get();
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      set({ tokenRefreshTimer: null });
    }
  },

  checkAuth: async () => {
    const userStr = safeLocalStorage.getItem("user", 'null');
    const token = safeLocalStorage.getItem("accessToken", 'null');
    const tokenExpiration = parseInt(safeLocalStorage.getItem("tokenExpiration", '0'));
    
    const user = userStr !== 'null' ? safeJsonParse(userStr, null) : null;
    let isAuthenticated = user !== null && token !== 'null';
    
    // Перевіряємо, чи термін дії токена закінчується незабаром
    if (isAuthenticated && tokenExpiration) {
      const timeUntilExpiration = tokenExpiration - Date.now();
      
      // Якщо термін дії токена закінчився або закінчується незабаром (менше 5 хвилин)
      if (timeUntilExpiration < 5 * 60 * 1000) {
        isAuthenticated = await get().refreshToken();
        if (!isAuthenticated) {
          set({ 
            signed: false, 
            user: null,
            token: null
          });
          return false;
        }
      }
    }
    
    set({ 
      signed: isAuthenticated, 
      user,
      token: isAuthenticated ? token : null,
      tokenExpiration: isAuthenticated ? tokenExpiration : null
    });
    
    return isAuthenticated;
  },

  login: (user, token, refreshToken) => {
    const expirationTime = Date.now() + 3600 * 1000;
    
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
        if (error.status === 401) {
            const refreshSuccessful = await get().refreshToken();
            if (refreshSuccessful) {
                try {
                    const response = await fetchData("cart", "GET");
                    set({ cart: response.cart || [], isCartLoading: false });
                } catch (retryError) {
                    console.error("Failed to fetch cart after token refresh", retryError);
                    set({ isCartLoading: false });
                }
            } else {
                set({ isCartLoading: false, cart: [] });
            }
        } else {
            console.error("Failed to fetch cart", error);
            set({ isCartLoading: false });
        }
    }
},

  refreshToken: async () => {
    try {
      const refreshToken = safeLocalStorage.getItem("refreshToken", 'null');
      
      if (refreshToken === 'null') {
        get().logout();
        return false;
      }

      const response = await fetchData("auth/refresh", "POST", { refreshToken });

      if (response && response.accessToken) {
        safeLocalStorage.setItem("accessToken", response.accessToken);
        const expirationTime = Date.now() + 3600 * 1000;
        safeLocalStorage.setItem("tokenExpiration", expirationTime.toString());
        
        set({ 
          token: response.accessToken,
          tokenExpiration: expirationTime
        });
        
        return true;
      } else {
        get().logout();
        return false;
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
      get().logout();
      return false;
    }
  },

  addToCart: async (product) => {
    if (!get().signed) {
      console.error("Cannot add to cart: User not authenticated");
      return;
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

    } catch (error: any) {
      if (error.status === 401) {
        const refreshSuccessful = await get().refreshToken();

        if (refreshSuccessful) {
          await get().addToCart(product);
        }
      } else {
        console.error("Failed to add to cart", error);
      }
    }
  },
  
  removeFromCart: async (code) => {
    if (!get().signed) {
      return;
    }
    
    try {
      await fetchData("cart", "DELETE", { code });

      set((state) => ({
        cart: state.cart.filter((item) => item.code !== code),
      }));
    } catch (error: any) {
      if (error.status === 401) {
        const refreshSuccessful = await get().refreshToken();

        if (refreshSuccessful) {
          await get().removeFromCart(code);
        }
      } else {
        console.error("Failed to remove from cart", error);
      }
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