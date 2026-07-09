import { useAuthStore } from '@/presentation/stores';
import { authService, type SignUpParams, type SignInParams } from '@/services/auth';
import { logger } from '@/services/logger';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    setUser,
    setLoading,
    setError,
    reset,
    hasRole,
    isCitizen,
    isOperator,
    isAdmin,
  } = useAuthStore();

  const signIn = async (params: SignInParams) => {
    logger.info('[useAuth] signIn called', { email: params.email });
    setLoading(true);
    setError(null);
    
    const result = await authService.signIn(params);
    
    if (result.left) {
      logger.error('[useAuth] signIn failed', { error: result.left.message });
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    logger.info('[useAuth] signIn success', { userId: result.right.id });
    setUser(result.right);
    setLoading(false);
    return { success: true, user: result.right };
  };

  const signUp = async (params: SignUpParams) => {
    logger.info('[useAuth] signUp called', { email: params.email, role: params.role });
    setLoading(true);
    setError(null);
    
    const result = await authService.signUp(params);
    
    if (result.left) {
      logger.error('[useAuth] signUp failed', { error: result.left.message });
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    logger.info('[useAuth] signUp success', { userId: result.right.id });
    setLoading(false);
    return { success: true, user: result.right };
  };

  const signOut = async () => {
    logger.info('[useAuth] signOut called');
    setLoading(true);
    
    const result = await authService.signOut();
    
    if (result.left) {
      logger.error('[useAuth] signOut failed', { error: result.left.message });
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    logger.info('[useAuth] signOut success');
    reset();
    queryClient.clear();
    return { success: true };
  };

  const resetPassword = async (email: string) => {
    logger.info('[useAuth] resetPassword called', { email });
    setLoading(true);
    setError(null);
    
    const result = await authService.resetPassword(email);
    
    if (result.left) {
      logger.error('[useAuth] resetPassword failed', { error: result.left.message });
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    logger.info('[useAuth] resetPassword success');
    setLoading(false);
    return { success: true };
  };

  const updatePassword = async (newPassword: string) => {
    logger.info('[useAuth] updatePassword called');
    setLoading(true);
    setError(null);
    
    const result = await authService.updatePassword(newPassword);
    
    if (result.left) {
      logger.error('[useAuth] updatePassword failed', { error: result.left.message });
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    logger.info('[useAuth] updatePassword success');
    setLoading(false);
    return { success: true };
  };

  const resendVerification = async (email: string) => {
    logger.info('[useAuth] resendVerification called', { email });
    setLoading(true);
    setError(null);
    
    const result = await authService.resendVerificationEmail(email);
    
    if (result.left) {
      logger.error('[useAuth] resendVerification failed', { error: result.left.message });
      setError(result.left.message);
      setLoading(false);
      return { success: false, error: result.left.message };
    }
    
    logger.info('[useAuth] resendVerification success');
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
