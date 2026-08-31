import { create } from 'zustand';

interface EditProductSheetState {
    isOpen: boolean;
    productId: string | null;
    onOpen: (productId: string) => void;
    onClose: () => void;
}

export const useEditProductSheet = create<EditProductSheetState>((set) => ({
    isOpen: false,
    productId: null,
    onOpen: (productId: string) => set({ isOpen: true, productId }),
    onClose: () => set({ isOpen: false, productId: null }),
}));
