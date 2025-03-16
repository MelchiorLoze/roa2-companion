import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, Countdown, ItemList } from '@/components';
import { useCoinStoreRotation } from '@/hooks/business';
import { usePurchaseInventoryItems } from '@/hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import { CurrencyId, Item } from '@/types/store';

export default function Store() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { coinStoreRotation, isLoading: isCoinStoreLoading } = useCoinStoreRotation();
  const { purchase, isLoading: isPurchaseLoading } = usePurchaseInventoryItems();

  const isLoading = isCoinStoreLoading || isPurchaseLoading;

  const handlePurchase = () => {
    if (!selectedItem?.coinPrice) return;
    purchase({
      id: selectedItem.id,
      price: { value: selectedItem.coinPrice, currencyId: CurrencyId.COINS },
    });
    closeDialog();
  };

  const closeDialog = () => setSelectedItem(null);

  if (isLoading) {
    return <ActivityIndicator color="white" size="large" style={styles.spinner} />;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Items refresh in:</Text>
          <Countdown date={coinStoreRotation?.expirationDate} style={styles.title} />
        </View>
        <ItemList items={coinStoreRotation.items} onSelect={setSelectedItem} />
      </View>
      {selectedItem && (
        <>
          <Pressable disabled={isLoading} onPress={closeDialog} style={styles.overlay} />
          <View style={styles.confirmationDialog}>
            <Text style={styles.title}>
              Are you sure you want to buy the {selectedItem.category} {selectedItem.title} for {selectedItem.coinPrice}
              ?
            </Text>
            <View style={styles.buttonContainer}>
              <Button label="Yes" onPress={handlePurchase} />
              <Button label="No" onPress={closeDialog} />
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  spinner: {
    flex: 1,
  },
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
    gap: theme.spacing.s,
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: theme.color.dark + 'AA',
  },
  confirmationDialog: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
    width: '75%',
    padding: theme.spacing.l,
    gap: theme.spacing.l,
    borderWidth: 2,
    borderColor: theme.color.accent,
    backgroundColor: theme.color.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}));
