import { Ionicons } from '@expo/vector-icons';
import {
  type BottomTabBarButtonProps,
  type BottomTabHeaderProps,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Header } from '@/components/Header/Header';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';
import { useAutomaticSessionRefresh } from '@/features/auth/hooks/business/useAutomaticSessionRefresh/useAutomaticSessionRefresh';
import { SeasonProvider } from '@/features/stats/contexts/SeasonContext/SeasonContext';

const renderHeader = ({ options }: BottomTabHeaderProps) => <Header showCurrencies title={options.title} />;

const renderTabBarButtonWithoutFeedback = (props: BottomTabBarButtonProps) => (
  <Pressable {...props} android_ripple={undefined} ref={undefined} />
);

type IconProps = ComponentProps<Required<BottomTabNavigationOptions>['tabBarIcon']>;

const renderStoreIcon = ({ color }: IconProps) => <Ionicons color={color} name="cart-sharp" size={24} />;
const renderStatsIcon = ({ color }: IconProps) => <Ionicons color={color} name="stats-chart-sharp" size={24} />;
const renderESportIcon = ({ color }: IconProps) => <Ionicons color={color} name="trophy-sharp" size={24} />;
const renderMoreIcon = ({ color }: IconProps) => <Ionicons color={color} name="information-circle-sharp" size={24} />;

export default function PrivateLayout() {
  const { theme } = useUnistyles();
  const { isLoggedIn } = useAuth();
  useAutomaticSessionRefresh();

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
          tabBarInactiveTintColor: theme.color.inactive,
          sceneStyle: { backgroundColor: theme.color.transparent },
        }}
      >
        <Tabs.Screen
          name="store"
          options={{
            title: 'Rotating coin shop',
            tabBarLabel: 'Store',
            tabBarIcon: renderStoreIcon,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: renderStatsIcon,
          }}
        />
        <Tabs.Screen
          name="e-sport"
          options={{
            title: 'start.gg Tournaments',
            tabBarLabel: 'E-Sport',
            tabBarIcon: renderESportIcon,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            tabBarIcon: renderMoreIcon,
          }}
        />
      </Tabs>
    </SeasonProvider>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    height: 60 + runtime.insets.bottom,
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
