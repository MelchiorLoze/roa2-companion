import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Countdown, ItemList } from '@/components';
import { useCoinStoreRotation } from '@/hooks/business';

export default function Store() {
  const { coinStoreRotation, isLoading } = useCoinStoreRotation();

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.spinner} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Items refresh in:</Text>
        <Countdown date={coinStoreRotation?.expirationDate} style={styles.title} />
      </View>
      <ItemList items={coinStoreRotation.items} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: 'darkblue',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    gap: 4,
  },
  title: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontFamily: 'AgencyFB-Bold',
    color: 'white',
  },
});
