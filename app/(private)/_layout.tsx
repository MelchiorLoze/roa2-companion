import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext/AuthContext';

export default function PrivateLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack>
      <Stack.Screen name="store" options={{ headerShown: false }} />
    </Stack>
  );
}
