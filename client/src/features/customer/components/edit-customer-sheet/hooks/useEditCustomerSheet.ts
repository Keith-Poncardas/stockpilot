import { create } from 'zustand';

interface EditCustomerSheetState {
    isOpen: boolean;
    customerId: string | null;
    onOpen: (customerId: string) => void;
    onClose: () => void;
}

export const useEditCustomerSheet = create<EditCustomerSheetState>((set) => ({
    isOpen: false,
    customerId: null,
    onOpen: (customerId) => set({ isOpen: true, customerId }),
    onClose: () => set({ isOpen: false, customerId: null }),
}));
