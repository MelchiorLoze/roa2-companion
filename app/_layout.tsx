import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StrictMode, useEffect } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { Header } from '@/components';
import { SessionProvider } from '@/contexts';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

const renderHeader = ({ options }: NativeStackHeaderProps) => <Header title={options.title} withBackNavigation />;

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
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

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
              contentStyle: { backgroundColor: theme.color.background },
            }}
          >
            <Stack.Screen name="sign-in" />
            <Stack.Screen
              name="about"
              options={{
                title: 'About this app',
                statusBarBackgroundColor: theme.color.highlight,
                contentStyle: { backgroundColor: theme.color.highlight },
              }}
            />
            <Stack.Screen name="(private)" options={{ headerShown: false }} />
          </Stack>
        </SessionProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
