import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService, type SignInParams, type CitizenSignUpParams } from '@/services/auth';
import { useAuthStore } from '@/presentation/stores';
import { QUERY_KEYS, AUTH_ROUTES } from '@/constants';
import { logger } from '@/services/logger';

export function useSignInMutation() {
  const queryClient = useQueryClient();
  const { setUser, setLoading, setError } = useAuthStore();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'signIn'],
    mutationFn: async (params: SignInParams) => {
      const result = await authService.signIn(params);
      if (result.left) {
        throw new Error(result.left.message);
      }
      return result.right;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (user) => {
      setUser(user);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH] });
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
}

export function useCitizenSignUpMutation() {
  const { setLoading, setError } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'citizenSignUp'],
    mutationFn: async (params: CitizenSignUpParams) => {
      const result = await authService.signUpCitizen(params);
      if (result.left) {
        throw new Error(result.left.message);
      }
      return result.right;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (_user, variables) => {
      setLoading(false);
      router.push({
        pathname: AUTH_ROUTES.VERIFY_EMAIL,
        params: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
}

export function useSignUpMutation() {
  const { setLoading, setError } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'signUp'],
    mutationFn: async (params: { email: string; password: string; displayName: string; role: 'citizen' | 'operator' }) => {
      const result = await authService.signUp(params);
      if (result.left) {
        throw new Error(result.left.message);
      }
      return result.right;
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (_user, variables) => {
      setLoading(false);
      router.push({
        pathname: AUTH_ROUTES.VERIFY_EMAIL,
        params: { email: variables.email },
      });
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  const { reset } = useAuthStore();

  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'signOut'],
    mutationFn: async () => {
      const result = await authService.signOut();
      if (result.left) {
        throw new Error(result.left.message);
      }
    },
    onSuccess: () => {
      reset();
      queryClient.clear();
      logger.info('User signed out successfully');
    },
    onError: (error: Error) => {
      logger.error('Sign out error', error.message);
    },
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'resetPassword'],
    mutationFn: async (email: string) => {
      const result = await authService.resetPassword(email);
      if (result.left) {
        throw new Error(result.left.message);
      }
    },
  });
}

export function useUpdatePasswordMutation() {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'updatePassword'],
    mutationFn: async (newPassword: string) => {
      const result = await authService.updatePassword(newPassword);
      if (result.left) {
        throw new Error(result.left.message);
      }
    },
  });
}

export function useResendVerificationMutation() {
  return useMutation({
    mutationKey: [QUERY_KEYS.AUTH, 'resendVerification'],
    mutationFn: async (email: string) => {
      const result = await authService.resendVerificationEmail(email);
      if (result.left) {
        throw new Error(result.left.message);
      }
    },
  });
}
