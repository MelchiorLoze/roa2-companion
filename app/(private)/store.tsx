import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, ItemList, Spinner, TimeCountdown } from '@/components';
import { Dialog } from '@/components/Dialog/Dialog';
import { useRotatingCoinShop } from '@/hooks/business';
import { usePurchaseInventoryItems } from '@/hooks/data';
import { CATEGORY_LABELS, CurrencyId, Item } from '@/types/store';

export default function Store() {
  const { theme } = useUnistyles();

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { items, expirationDate, isLoading: isCoinShopLoading } = useRotatingCoinShop();
  const { purchase, isLoading: isPurchaseLoading } = usePurchaseInventoryItems();

  const handlePurchase = () => {
    if (!selectedItem?.coinPrice) return;
    purchase({
      id: selectedItem.id,
      price: { value: selectedItem.coinPrice, currencyId: CurrencyId.COINS },
    });
    closeDialog();
  };

  const openDialog = (item: Item) => {
    if (item.coinPrice) setSelectedItem(item);
  };

  const closeDialog = () => setSelectedItem(null);

  useFocusEffect(useCallback(closeDialog, []));

  if (isCoinShopLoading || isPurchaseLoading) return <Spinner />;

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
      {selectedItem && (
        <Dialog onClose={closeDialog}>
          <Text style={styles.title}>
            Are you sure you want to buy the {CATEGORY_LABELS[selectedItem.category]} {selectedItem.title} for{' '}
            {selectedItem.coinPrice}?
          </Text>
          <View style={styles.buttonContainer}>
            <Button label="Yes" onPress={handlePurchase} />
            <Button label="No" onPress={closeDialog} />
          </View>
        </Dialog>
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}));
