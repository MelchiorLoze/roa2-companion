import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImageBackground } from 'expo-image';
import { type NativeStackHeaderProps, SplashScreen, Stack } from 'expo-router';
import { StrictMode } from 'react';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

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

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ImageBackground source={AppBackground} style={styles.backgroundImage}>
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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
});
