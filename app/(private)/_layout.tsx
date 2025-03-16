import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Header } from '@/components';
import { useAuth } from '@/hooks/business';

const renderHeader = (props: BottomTabHeaderProps) => <Header {...props} />;

export default function PrivateLayout() {
  const { theme } = useUnistyles();
  const { isLoggedIn } = useAuth({ enableAutoRefresh: true });

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: renderHeader,
        tabBarStyle: styles.container,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: theme.color.white,
        sceneStyle: { backgroundColor: theme.color.highlight },
      }}
    >
      <Tabs.Screen
        name="store"
        options={{
          title: 'Rotating coin shop',
          tabBarLabel: 'Store',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="cart-sharp" size={24} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="stats-chart-sharp" size={24} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Ionicons color={color} name="information-circle-sharp" size={24} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    backgroundColor: theme.color.background,
    height: 60,
    borderColor: theme.color.accent,
    borderTopWidth: 2,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: 14,
    fontFamily: theme.font.primary.italic,
  },
}));
