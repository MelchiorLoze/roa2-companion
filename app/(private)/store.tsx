import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button, Countdown, ItemList, Spinner } from '@/components';
import { useRotatingCoinShop } from '@/hooks/business';
import { usePurchaseInventoryItems } from '@/hooks/data';
import { CurrencyId, Item } from '@/types/store';

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
        <LinearGradient colors={theme.color.labelGradient()} end={[1, 0]} start={[0, 0]} style={styles.titleContainer}>
          <Text style={styles.title}>Items refresh in:</Text>
          <Countdown date={expirationDate} style={styles.title} />
        </LinearGradient>
        <ItemList items={items} onSelect={openDialog} />
      </View>
      {selectedItem && (
        <>
          <Pressable onPress={closeDialog} style={styles.overlay} testID="overlay" />
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
