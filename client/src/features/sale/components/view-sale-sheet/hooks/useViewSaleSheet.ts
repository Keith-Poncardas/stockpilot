import { create } from 'zustand';

interface ViewSaleSheetState {
    isOpen: boolean;
    saleId: string | null;
    onOpen: (saleId: string) => void;
    onClose: () => void;
}

export const useViewSaleSheet = create<ViewSaleSheetState>((set) => ({
    isOpen: false,
    saleId: null,
    onOpen: (saleId) => set({ isOpen: true, saleId }),
    onClose: () => set({ isOpen: false, saleId: null }),
}));
