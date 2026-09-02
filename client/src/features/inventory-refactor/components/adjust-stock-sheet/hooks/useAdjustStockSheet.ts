import { create } from 'zustand';

interface AdjustStockSheetState {
    isOpen: boolean;
    inventoryId: string | null;
    onOpen: (inventoryId: string) => void;
    onClose: () => void;
}

export const useAdjustStockSheet = create<AdjustStockSheetState>((set) => ({
    isOpen: false,
    inventoryId: null,
    onOpen: (inventoryId: string) => set({ isOpen: true, inventoryId }),
    onClose: () => set({ isOpen: false, inventoryId: null }),
}));
