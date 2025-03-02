import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

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
          color="red"
          iconStyle={styles.logoutIcon}
          name="power-off"
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

const styles = StyleSheet.create({
  topContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    paddingLeft: 16,
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'darkblue',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyLabel: {
    color: 'white',
  },
  currencyIcon: {
    width: 24,
    height: 24,
  },
  logoutIcon: {
    marginRight: 0,
  },
});
