import { create } from 'zustand';

const STORAGE_KEY = 'auth-storage';

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CASHIER'

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
}

interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User, token: string, rememberMe?: boolean) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

function loadAuthState(): { user: User | null; token: string | null } {
    try {
        const raw =
            localStorage.getItem(STORAGE_KEY) ??
            sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return { user: null, token: null };
        return JSON.parse(raw);
    } catch {
        return { user: null, token: null };
    }
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    ...loadAuthState(),

    login: (user, token, rememberMe = false) => {
        const payload = JSON.stringify({ user, token });
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(STORAGE_KEY, payload);
        set({ user, token });
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        set({ user: null, token: null });
    },

    isAuthenticated: () => !!get().token,
}));