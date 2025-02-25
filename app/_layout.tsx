import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StrictMode } from 'react';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(private)" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
