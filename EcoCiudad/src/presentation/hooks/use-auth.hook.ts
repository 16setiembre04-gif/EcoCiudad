import { useEffect } from 'react';
import { useAuthStore } from '@/presentation/stores';
import { authService, type SignUpParams, type SignInParams } from '@/services/auth';
import { logger } from '@/services/logger';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    setUser,
    setLoading,
    setInitialized,
    setError,
    reset,
    hasRole,
    isCitizen,
    isOperator,
    isAdmin,
  } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      const { data: { subscription } } = authService.onAuthStateChange(
        async (event, session) => {
          logger.debug('Auth state changed', { event });
          
          if (event === 'SIGNED_IN' && session) {
            const result = await authService.getCurrentUser();
            if (result.right) {
              setUser(result.right);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          } else if (event === 'TOKEN_REFRESHED') {
            const result = await authService.getCurrentUser();
            if (result.right) {
              setUser(result.right);
            }
          }
        }
      );

      const sessionResult = await authService.getSession();
      if (sessionResult.right) {
        setUser(sessionResult.right.user);
      } else {
        setUser(null);
      }
      
      setInitialized(true);
      setLoading(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const signIn = async (params: SignInParams) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signIn(params);
    
    if (result.left) {
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    setUser(result.right);
    setLoading(false);
    return { success: true, user: result.right };
  };

  const signUp = async (params: SignUpParams) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.signUp(params);
    
    if (result.left) {
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    setLoading(false);
    return { success: true, user: result.right };
  };

  const signOut = async () => {
    setLoading(true);
    
    const result = await authService.signOut();
    
    if (result.left) {
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    reset();
    return { success: true };
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.resetPassword(email);
    
    if (result.left) {
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    setLoading(false);
    return { success: true };
  };

  const updatePassword = async (newPassword: string) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.updatePassword(newPassword);
    
    if (result.left) {
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    setLoading(false);
    return { success: true };
  };

  const resendVerification = async (email: string) => {
    setLoading(true);
    setError(null);
    
    const result = await authService.resendVerificationEmail(email);
    
    if (result.left) {
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    setLoading(false);
    return { success: true };
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    hasRole,
    isCitizen,
    isOperator,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    resendVerification,
    clearError: () => setError(null),
  };
}

export function useSession() {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
  };
}

export function useRequireAuth() {
  const { user, isAuthenticated, isInitialized } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isInitialized,
    isReady: isInitialized && isAuthenticated,
  };
}

export function useRequireRole(roles: string | string[]) {
  const { user, isAuthenticated, isInitialized, hasRole } = useAuthStore();
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasAccess = hasRole(allowedRoles as any);
  
  return {
    user,
    isAuthenticated,
    isInitialized,
    hasAccess,
    isReady: isInitialized && isAuthenticated && hasAccess,
  };
}
