import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/context';
import { useAuthStore } from '@/presentation/stores';
import { SessionProvider } from '@/presentation/components/organisms/auth-guard/session-provider';
import { TranslationProvider } from '@/localization';
import { logger } from '@/services/logger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  logger.info('[AppProviders] Component rendered');
  
  const user = useAuthStore((state) => state.user);
  const role = user?.role === 'operator' ? 'operator' : user?.role === 'admin' ? 'admin' : 'citizen';

  logger.info('[AppProviders] Wrapping children with providers', { role });

  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <SessionProvider>
          <ThemeProvider role={role}>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}