import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchData } from "../api/service";

interface User {
  id: number;
  email: string;
  fullname: string;
  role: string;
}

interface Product {
  code: string;
  shape: string;
  dimensions: string;
  images: string;
  is_in_cart?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  signed: boolean;

  cart: CartItem[];

  isOpen: boolean;
  setOpen: (val: boolean) => void;

  login: (email: string, password: string) => Promise<boolean>;
  getUser: () => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;

  fetchCart: () => Promise<void>;
  addToCart: (code: string) => Promise<void>;
  removeFromCart: (code: string) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      signed: false,

      cart: [],

      isOpen: false,
      setOpen: (val) => set({ isOpen: val }),

      login: async (email, password) => {
        try {
          const res = await fetchData("login", "POST", { email, password });

          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            signed: true,
          });

          await get().getUser();
          return true;
        } catch (e) {
          console.error("Login failed", e);
          return false;
        }
      },

      getUser: async () => {
        try {
          const res = await fetchData("user", "GET");
          set({ user: res.user });
        } catch (e) {
          console.error("Get user failed", e);
          await get().logout();
        }
      },

      logout: async () => {
        try {
          const token = get().refreshToken;
          if (token) {
            await fetchData("logout", "POST", { refreshToken: token });
          }
        } catch (e) {
          console.warn("Logout fallback triggered");
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            signed: false,
            cart: [],
          });
        }
      },

      refresh: async () => {
        try {
          const token = get().refreshToken;
          const res = await fetchData("refresh", "POST", { refreshToken: token });

          set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            signed: true,
          });

          return true;
        } catch (e) {
          console.error("Refresh failed", e);
          await get().logout();
          return false;
        }
      },

      checkAuth: async () => {
        const { accessToken, user } = get();
        const valid = Boolean(accessToken && user);
        set({ signed: valid });
        return valid;
      },

      fetchCart: async () => {
        try {
          const res = await fetchData("cart", "GET");
          set({ cart: res.cart });
        } catch (e) {
          console.error("Fetching cart failed", e);
          const refreshed = await get().refresh();
          if (refreshed) {
            try {
              const res = await fetchData("cart", "GET");
              set({ cart: res.cart });
            } catch (err) {
              console.error("Retry fetchCart failed", err);
            }
          }
        }
      },

      addToCart: async (code) => {
        try {
          await fetchData("cart", "POST", { code });
        } catch (e) {
          console.error("Add to cart failed", e);
        }
      },

      removeFromCart: async (code) => {
        try {
          await fetchData("cart", "DELETE", { code });
        } catch (e) {
          console.error("Remove from cart failed", e);
        }
      },
    }),
    { name: "main-store" }
  )
);
