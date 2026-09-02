import { create } from 'zustand';

interface ViewProductSheetState {
    isOpen: boolean;
    productId: string | null;
    onOpen: (productId: string) => void;
    onClose: () => void;
}

export const useViewProductSheet = create<ViewProductSheetState>((set) => ({
    isOpen: false,
    productId: null,
    onOpen: (productId: string) => set({ isOpen: true, productId }),
    onClose: () => set({ isOpen: false, productId: null }),
}));
