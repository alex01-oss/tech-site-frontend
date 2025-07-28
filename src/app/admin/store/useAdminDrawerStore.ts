import { create } from 'zustand';

interface AdminDrawerState {
    isOpen: boolean;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

export const useAdminDrawerStore = create<AdminDrawerState>((set) => ({
    isOpen: false,
    closeDrawer: () => set({ isOpen: false }),
    toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
}));
