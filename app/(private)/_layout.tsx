import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Redirect, Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

import { Header } from '@/components';
import { useAuth } from '@/hooks/business';

const renderHeader = (props: NativeStackHeaderProps) => <Header {...props} />;

export default function PrivateLayout() {
  const { theme } = useUnistyles();
  const { isLoggedIn } = useAuth({ enableAutoRefresh: true });

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        header: renderHeader,
        statusBarBackgroundColor: theme.color.highlight,
        navigationBarColor: theme.color.highlight,
      }}
    >
      <Stack.Screen name="store" options={{ title: 'Rotating coin shop' }} />
    </Stack>
  );
}
