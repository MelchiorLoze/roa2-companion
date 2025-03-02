import { Redirect, Stack } from 'expo-router';

import { Header } from '@/components';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

export default function PrivateLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ header: Header }}>
      <Stack.Screen name="store" options={{ title: 'Coins store' }} />
    </Stack>
  );
}
