import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StrictMode } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { Header } from '@/components/Header/Header';
import { SessionProvider } from '@/features/auth/contexts/SessionContext/SessionContext';
import { useAppFonts } from '@/hooks/core/useAppFonts/useAppFonts';

const queryClient = new QueryClient();

const renderHeader = ({ options }: NativeStackHeaderProps) => <Header title={options.title} withBackNavigation />;

export default function RootLayout() {
  useAppFonts();
  const { theme } = useUnistyles();

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <Stack
            initialRouteName="sign-in"
            screenOptions={{
              header: renderHeader,
              statusBarBackgroundColor: theme.color.highlight,
              navigationBarColor: theme.color.background,
              contentStyle: { backgroundColor: theme.color.highlight },
            }}
          >
            <Stack.Screen name="sign-in" options={{ contentStyle: { backgroundColor: theme.color.background } }} />
            <Stack.Screen name="about" options={{ title: 'About this app' }} />
            <Stack.Screen name="(private)" options={{ headerShown: false }} />
          </Stack>
        </SessionProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
