import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { ExternalPathString, useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

type Props = {
  label: string;
  url?: URL;
  logo?: URL;
  iconName: ComponentProps<typeof MaterialIcons>['name'];
  onPress?: () => void;
};

export const ActionRow = ({ label, url, logo, iconName, onPress }: Props) => {
  const router = useRouter();
  const { theme } = useUnistyles();

  return (
    <Pressable
      onPress={() => (url ? router.push(url.toString() as ExternalPathString) : onPress?.())}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
    >
      {({ pressed }) => (
        <>
          {logo && <Image contentFit="contain" source={logo.toString()} style={styles.logo} />}
          <Text style={[styles.label, pressed && styles.labelPressed]}>{label}</Text>
          <MaterialIcons
            color={pressed ? theme.color.black : theme.color.white}
            name={iconName}
            size={20}
            style={styles.icon}
          />
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    gap: theme.spacing.s,
    backgroundColor: theme.color.background,
  },
  containerPressed: {
    backgroundColor: theme.color.accent,
  },
  logo: {
    width: 20,
    height: 20,
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  labelPressed: {
    color: theme.color.black,
  },
  icon: {
    marginLeft: 'auto',
  },
}));
