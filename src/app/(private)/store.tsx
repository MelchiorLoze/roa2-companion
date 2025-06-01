import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Spinner } from '@/components';
import {
  type Item,
  ItemList,
  type ItemWithCoinPrice,
  PurchaseConfirmationDialog,
  TimeCountdown,
  useRotatingCoinShop,
} from '@/features/store';

export default function Store() {
  const { theme } = useUnistyles();

  const [selectedItem, setSelectedItem] = useState<ItemWithCoinPrice | null>(null);
  const { items, expirationDate, isLoading } = useRotatingCoinShop();

  const openDialog = (item: Item) => {
    if (item.coinPrice) setSelectedItem(item as ItemWithCoinPrice);
  };

  const closeDialog = () => setSelectedItem(null);

  useFocusEffect(useCallback(closeDialog, []));

  if (isLoading) return <Spinner />;

  return (
    <>
      <View style={styles.container}>
        {expirationDate && (
          <LinearGradient colors={theme.color.labelGradient} end={[1, 0]} start={[0, 0]} style={styles.titleContainer}>
            <Text style={styles.title}>Items refresh in:</Text>
            <TimeCountdown date={expirationDate} style={styles.title} />
          </LinearGradient>
        )}
        <ItemList items={items} onSelect={openDialog} />
      </View>
      {selectedItem && <PurchaseConfirmationDialog item={selectedItem} onClose={closeDialog} />}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing.s,
    paddingRight: theme.spacing.m,
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
