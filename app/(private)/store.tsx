import { ActivityIndicator, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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

const styles = StyleSheet.create((theme) => ({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: theme.spacing.l,
    gap: theme.spacing.l,
    backgroundColor: theme.color.highlight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
    gap: theme.spacing.s,
  },
  title: {
    fontSize: theme.spacing.l,
    textTransform: 'uppercase',
    fontFamily: theme.font.secondary.bold,
    color: theme.color.white,
  },
}));
