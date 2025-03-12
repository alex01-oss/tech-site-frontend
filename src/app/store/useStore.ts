import { create } from "zustand";
import { fetchData } from "../api/service";

interface User {
  email: string;
  username?: string;
}

interface CartItem {
  article: string;
  title: string;
  price: number;
  currency: string;
  images: string;
}

interface StoreState {
  user: User | null;
  token: string | null;
  tokenExpiration: number | null;
  signed: boolean;
  isOpen: boolean;
  cart: CartItem[];
  selectedProducts: string[];
  isInitialized: boolean;
  isCartLoading: boolean;
  
  initialize: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  login: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  setOpen: (isOpen: boolean) => void;
  
  fetchCart: () => Promise<void>;
  addToCart: (product: CartItem) => Promise<void>;
  removeFromCart: (article: string) => Promise<void>;
  toggleProductSelection: (article: string) => void;
  refreshToken: () => Promise<boolean>;
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

  initialize: async () => {
    const isAuthenticated = await get().checkAuth();
    
    if (isAuthenticated) {
      await get().fetchCart();
    }
    
    set({ isInitialized: true });
  },

  checkAuth: async () => {
    const userStr = safeLocalStorage.getItem("user", 'null');
    const token = safeLocalStorage.getItem("accessToken", 'null');
    const tokenExpiration = parseInt(safeLocalStorage.getItem("tokenExpiration", '0'));
    
    const user = userStr !== 'null' ? safeJsonParse(userStr, null) : null;
    let isAuthenticated = user !== null && token !== 'null';
    
    if (isAuthenticated && tokenExpiration && tokenExpiration < Date.now()) {
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

    console.log("User logged in:", get());
    get().fetchCart();
  },

  logout: () => {
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
        console.warn("Skipping cart fetch: User is not authenticated");
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
                console.warn("User unauthorized, skipping cart update");
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
        article: product.article,
        title: product.title,
        price: product.price,
        currency: product.currency,
        images: product.images
      });
      
      set((state) => ({ 
        cart: [...state.cart.filter(item => item.article !== product.article), product] 
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

  removeFromCart: async (article) => {
    if (!get().signed) {
      console.error("Cannot remove from cart: User not authenticated");
      return;
    }
    
    try {
      await fetchData("cart", "DELETE", { article });
      
      set((state) => ({
        cart: state.cart.filter((item) => item.article !== article),
      }));
    } catch (error: any) {
      if (error.status === 401) {
        const refreshSuccessful = await get().refreshToken();
        if (refreshSuccessful) {
          await get().removeFromCart(article);
        }
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