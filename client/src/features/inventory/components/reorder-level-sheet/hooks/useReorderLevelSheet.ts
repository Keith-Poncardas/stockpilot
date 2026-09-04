import { create } from 'zustand';

interface ReorderLevelSheetState {
    isOpen: boolean;
    inventoryId: string | null;
    onOpen: (inventoryId: string) => void;
    onClose: () => void;
}

export const useReorderLevelSheet = create<ReorderLevelSheetState>((set) => ({
    isOpen: false,
    inventoryId: null,
    onOpen: (inventoryId) => set({ isOpen: true, inventoryId }),
    onClose: () => set({ isOpen: false, inventoryId: null }),
}));
