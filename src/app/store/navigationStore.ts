import { create } from 'zustand';

interface NavigationState {
    isNavigating: boolean;
    setIsNavigating: (navigating: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
    isNavigating: false,
    setIsNavigating: (navigating) => set({ isNavigating: navigating }),
}));