import { create } from 'zustand';

interface ViewCustomerSheetState {
    isOpen: boolean;
    customerId: string | null;
    onOpen: (customerId: string) => void;
    onClose: () => void;
}

export const useViewCustomerSheet = create<ViewCustomerSheetState>((set) => ({
    isOpen: false,
    customerId: null,
    onOpen: (customerId) => set({ isOpen: true, customerId }),
    onClose: () => set({ isOpen: false, customerId: null }),
}));
