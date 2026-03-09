import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface AuthState {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setRole: (role: UserRole | null) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isLoading: true,
    setUser: (user) => set({ user, role: user?.role || null }),
    setRole: (role) => set({ role }),
    setLoading: (isLoading) => set({ isLoading }),
    logout: () => set({ user: null, role: null, isLoading: false }),
}));
