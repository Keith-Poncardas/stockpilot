import { create } from 'zustand';

interface POSSheetState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const usePOSSheet = create<POSSheetState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
