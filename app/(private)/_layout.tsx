import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Redirect, Stack } from 'expo-router';

import { Header } from '@/components';
import { useAuth } from '@/contexts/AuthContext/AuthContext';

const renderHeader = (props: NativeStackHeaderProps) => <Header {...props} />;

export default function PrivateLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack screenOptions={{ header: renderHeader }}>
      <Stack.Screen name="store" options={{ title: 'Coins store' }} />
    </Stack>
  );
}
