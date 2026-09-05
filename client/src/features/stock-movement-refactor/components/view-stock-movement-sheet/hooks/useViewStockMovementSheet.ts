import { create } from 'zustand';

interface ViewStockMovementSheetState {
    isOpen: boolean;
    stockMovementId: string | null;
    onOpen: (stockMovementId: string) => void;
    onClose: () => void;
}

export const useViewStockMovementSheet = create<ViewStockMovementSheetState>((set) => ({
    isOpen: false,
    stockMovementId: null,
    onOpen: (stockMovementId) => set({ isOpen: true, stockMovementId }),
    onClose: () => set({ isOpen: false, stockMovementId: null }),
}));
