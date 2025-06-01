import type { QueryClientConfig } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

const queryClientTestConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
      gcTime: 0,
    },
  },
};

export const TestQueryClientProvider = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient(queryClientTestConfig);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
