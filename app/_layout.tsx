import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StrictMode, useEffect } from 'react';

import { AuthProvider } from '@/contexts/AuthContext/AuthContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'AgencyFB-Bold': require('../assets/fonts/AgencyFB-Bold.ttf'),
    'AgencyFB-Black': require('../assets/fonts/AgencyFB-Black.otf'),
    'FranklinGothicDemiCond-Regular': require('../assets/fonts/FranklinGothicDemiCond-Regular.ttf'),
    'FranklinGothicDemiCond-Italic': require('../assets/fonts/FranklinGothicDemiCond-Italic.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false, statusBarBackgroundColor: '#0E0B2A' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(private)" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
