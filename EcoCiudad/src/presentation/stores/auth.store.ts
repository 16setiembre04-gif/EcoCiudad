import { create } from 'zustand';
import { type User, type UserRole } from '@/domain/entities';
import { logger } from '@/services/logger';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isCitizen: () => boolean;
  isOperator: () => boolean;
  isAdmin: () => boolean;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,
  
  setUser: (user) => {
    logger.info('[AuthStore] setUser called', { user: user?.displayName, isAuthenticated: !!user });
    set({ 
      user, 
      isAuthenticated: !!user, 
      isLoading: false,
      error: null,
    });
  },
  
  setLoading: (isLoading) => {
    logger.info('[AuthStore] setLoading', { isLoading });
    set({ isLoading });
  },
  
  setInitialized: (isInitialized) => {
    logger.info('[AuthStore] setInitialized', { isInitialized });
    set({ isInitialized });
  },
  
  setError: (error) => {
    logger.error('[AuthStore] setError', { error });
    set({ error, isLoading: false });
  },
  
  reset: () => {
    logger.info('[AuthStore] reset called');
    set(initialState);
  },
  
  hasRole: (role) => {
    const { user } = get();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  },
  
  isCitizen: () => {
    const { user } = get();
    return user?.role === 'citizen';
  },
  
  isOperator: () => {
    const { user } = get();
    return user?.role === 'operator';
  },
  
  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  },
}));
