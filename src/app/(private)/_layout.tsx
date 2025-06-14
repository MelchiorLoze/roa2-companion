import { Ionicons } from '@expo/vector-icons';
import { type BottomTabBarButtonProps, type BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Header } from '@/components/Header/Header';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';
import { SeasonProvider } from '@/features/stats/contexts/SeasonContext/SeasonContext';

const renderHeader = ({ options }: BottomTabHeaderProps) => <Header showCurrencies title={options.title} />;

const renderTabBarButtonWithoutFeedback = (props: BottomTabBarButtonProps) => (
  <Pressable {...props} android_ripple={undefined} ref={undefined} />
);

export default function PrivateLayout() {
  const { theme } = useUnistyles();
  const { isLoggedIn } = useAuth({ enableAutoRefresh: true });

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SeasonProvider>
      <Tabs
        screenOptions={{
          header: renderHeader,
          tabBarButton: renderTabBarButtonWithoutFeedback,
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
            tabBarIcon: ({ color }) => <Ionicons color={color} name="information-circle-sharp" size={24} />,
          }}
        />
      </Tabs>
    </SeasonProvider>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    height: 60,
    backgroundColor: theme.color.background,
    borderTopWidth: 2,
    borderColor: theme.color.accent,
  },
  label: {
    fontFamily: theme.font.primary.italic,
    fontSize: 14,
    textTransform: 'uppercase',
  },
}));
