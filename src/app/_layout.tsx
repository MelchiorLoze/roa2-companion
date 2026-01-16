import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImageBackground } from 'expo-image';
import * as NavigationBar from 'expo-navigation-bar';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StrictMode, useEffect } from 'react';
import { useUnistyles } from 'react-native-unistyles';

import { AppBackground } from '@/assets/images';
import { Header } from '@/components/Header/Header';
import { SessionProvider } from '@/features/auth/contexts/SessionContext/SessionContext';
import { useAppFonts } from '@/hooks/core/useAppFonts/useAppFonts';

const queryClient = new QueryClient();

void SplashScreen.preventAutoHideAsync();
const onFontLoaded = (): void => void SplashScreen.hideAsync();

const renderHeader = ({ options }: NativeStackHeaderProps) => <Header title={options.title} withBackNavigation />;

export default function RootLayout() {
  useAppFonts({ onLoaded: onFontLoaded });
  const { theme } = useUnistyles();

  // Set navigation bar style to dark (dark background with light buttons)
  useEffect(() => void NavigationBar.setStyle('dark'), []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          {/* Ensure content is drawn under the status bar */}
          <StatusBar backgroundColor="transparent" style="light" translucent />

          <ImageBackground source={AppBackground} style={{ flex: 1 }}>
            <Stack
              initialRouteName="sign-in"
              screenOptions={{
                header: renderHeader,
                contentStyle: { backgroundColor: theme.color.transparent },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="sign-in" />
              <Stack.Screen name="about" options={{ title: 'About this app' }} />
              <Stack.Screen name="(private)" options={{ headerShown: false }} />
            </Stack>
          </ImageBackground>
        </SessionProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}
