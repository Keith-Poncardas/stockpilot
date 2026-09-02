import { create } from 'zustand';

interface CreateProductSheetState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateProductSheet = create<CreateProductSheetState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
