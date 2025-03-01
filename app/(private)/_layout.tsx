import { Redirect, Stack } from 'expo-router';

import { LogoutButton } from '@/components/LogoutButton/LogoutButton';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

export default function PrivateLayout() {
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ headerRight: () => <LogoutButton onPress={logout} /> }}>
      <Stack.Screen name="store" options={{ title: 'Coins store' }} />
    </Stack>
  );
}
