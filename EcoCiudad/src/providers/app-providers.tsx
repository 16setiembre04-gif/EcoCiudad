import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/theme/context';
import { useAuthStore } from '@/presentation/stores';

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
  const user = useAuthStore((state) => state.user);
  const role = user?.role === 'operator' ? 'operator' : 'citizen';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider role={role}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
