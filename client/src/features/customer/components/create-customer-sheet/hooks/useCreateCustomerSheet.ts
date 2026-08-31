import { create } from 'zustand';

interface CreateCustomerSheetState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const useCreateCustomerSheet = create<CreateCustomerSheetState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));
