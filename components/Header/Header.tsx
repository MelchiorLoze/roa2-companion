import FontAwesome from '@expo/vector-icons/FontAwesome6';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useCurrencyBalance } from '@/hooks/business';

export const Header = ({ options }: NativeStackHeaderProps) => {
  const { logout } = useAuth();
  const { coinsBalance, bucksBalance } = useCurrencyBalance();

  return (
    <>
      <View style={styles.topContainer}>
        <Text style={styles.title}>{options.title}</Text>
        <FontAwesome.Button
          backgroundColor="transparent"
          color="crimson"
          iconStyle={styles.logoutIcon}
          name="arrow-right-from-bracket"
          onPress={logout}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.currencyContainer}>
          <Image contentFit="contain" source={require('@/assets/images/coins.png')} style={styles.currencyIcon} />
          <Text style={styles.currencyLabel}>{coinsBalance}</Text>
        </View>
        <View style={styles.currencyContainer}>
          <Image contentFit="contain" source={require('@/assets/images/bucks.png')} style={styles.currencyIcon} />
          <Text style={styles.currencyLabel}>{bucksBalance}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    paddingLeft: theme.spacing.l,
    backgroundColor: theme.color.highlight,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.font.primary.italic,
    textTransform: 'uppercase',
    color: theme.color.white,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: theme.spacing.s,
    backgroundColor: theme.color.background,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.s,
  },
  currencyLabel: {
    color: theme.color.white,
    fontFamily: theme.font.secondary.black,
  },
  currencyIcon: {
    width: 24,
    height: 24,
  },
  logoutIcon: {
    marginRight: theme.spacing.none,
  },
}));
