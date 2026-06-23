import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'expo-image';
import { Redirect, Tabs } from 'expo-router';
import {
  type BottomTabBarButtonProps,
  type BottomTabHeaderProps,
  type BottomTabNavigationOptions,
} from 'expo-router/build/react-navigation/bottom-tabs';
import { type ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { TabBarBackground } from '@/assets/images/ui';
import { FancyText } from '@/components/FancyText/FancyText';
import { Header } from '@/components/Header/Header';
import { useAuth } from '@/features/auth/hooks/business/useAuth/useAuth';
import { useAutomaticSessionRefresh } from '@/features/auth/hooks/business/useAutomaticSessionRefresh/useAutomaticSessionRefresh';
import { SeasonProvider } from '@/features/stats/contexts/SeasonContext/SeasonContext';

const renderHeader = ({ options, route }: BottomTabHeaderProps) => {
  const title = typeof options.headerTitle === 'string' ? options.headerTitle : route.name;

  return <Header showCurrencies title={title} />;
};

const renderTabBarBackground = () => (
  <ImageBackground contentFit="fill" source={TabBarBackground} style={StyleSheet.absoluteFill} />
);

const renderTabBarButtonWithoutFeedback = (props: BottomTabBarButtonProps) => (
  <Pressable {...props} android_ripple={undefined} ref={undefined} />
);

type IconProps = ComponentProps<Required<BottomTabNavigationOptions>['tabBarIcon']>;

const renderStoreIcon = ({ color }: IconProps) => <Ionicons color={color} name="cart-sharp" size={24} />;
const renderStatsIcon = ({ color }: IconProps) => <Ionicons color={color} name="stats-chart-sharp" size={24} />;
const renderESportIcon = ({ color }: IconProps) => <Ionicons color={color} name="trophy-sharp" size={24} />;
const renderMoreIcon = ({ color }: IconProps) => <Ionicons color={color} name="information-circle-sharp" size={24} />;

type TabBarLabelProps = ComponentProps<Exclude<Required<BottomTabNavigationOptions>['tabBarLabel'], string>>;
const renderTabBarLabel = ({ focused, children }: TabBarLabelProps) => (
  <FancyText style={styles.label(focused)} text={children.toUpperCase()} />
);

export default function PrivateLayout() {
  const { theme } = useUnistyles();
  const { isLoggedIn } = useAuth();
  useAutomaticSessionRefresh();

  if (!isLoggedIn) return <Redirect href="/sign-in" />;

  return (
    <SeasonProvider>
      <Tabs
        screenOptions={{
          header: renderHeader,
          tabBarButton: renderTabBarButtonWithoutFeedback,
          tabBarStyle: styles.container,
          tabBarLabel: renderTabBarLabel,
          tabBarActiveTintColor: theme.color.white,
          tabBarInactiveTintColor: theme.color.inactive,
          sceneStyle: { backgroundColor: theme.color.transparent },
          tabBarBackground: renderTabBarBackground,
        }}
      >
        <Tabs.Screen
          name="store"
          options={{
            tabBarIcon: renderStoreIcon,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            tabBarIcon: renderStatsIcon,
          }}
        />
        <Tabs.Screen
          name="e-sport"
          options={{
            headerTitle: 'start.gg Tournaments',
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
    borderTopWidth: 2,
    borderColor: theme.color.headerSeparator,
  },
  label: (focused: boolean) => ({
    fontFamily: theme.font.secondary.bold,
    fontSize: 14,
    color: focused ? theme.color.white : theme.color.inactive,
    skew: -0.1,
  }),
}));
