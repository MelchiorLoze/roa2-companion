import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { ExternalPathString, useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

type Props = {
  label: string;
  url?: URL;
  logo?: URL;
  iconName: ComponentProps<typeof Feather>['name'];
  onPress?: () => void;
};

export const ActionRow = ({ label, url, logo, iconName, onPress }: Props) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => (url ? router.push(url.toString() as ExternalPathString) : onPress?.())}
      style={styles.container}
    >
      {logo && <Image source={logo.toString()} style={styles.logo} />}
      <Text style={styles.label}>{label}</Text>
      <Feather color="white" name={iconName} size={16} style={styles.icon} />
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.l,
    gap: theme.spacing.m,
    backgroundColor: theme.color.background,
  },
  logo: {
    width: 16,
    height: 16,
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 14,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  icon: {
    marginLeft: 'auto',
  },
}));
