import { create } from 'zustand';

interface CreateInventorySheetState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateInventorySheet = create<CreateInventorySheetState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
