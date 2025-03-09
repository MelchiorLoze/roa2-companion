import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StrictMode, useEffect } from 'react';
import { useUnistyles } from 'react-native-unistyles';

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
  const { theme } = useUnistyles();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack
            initialRouteName="sign-in"
            screenOptions={{
              headerShown: false,
              statusBarBackgroundColor: theme.color.background,
              navigationBarColor: theme.color.background,
            }}
          >
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="(private)" />
          </Stack>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
