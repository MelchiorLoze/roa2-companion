import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';
import { ItemList } from '@/features/store/components/ItemList/ItemList';
import { PurchaseConfirmationDialog } from '@/features/store/components/PurchaseConfirmationDialog/PurchaseConfirmationDialog';
import { TimeCountdown } from '@/features/store/components/TimeCountdown/TimeCountdown';
import { useRotatingCoinShop } from '@/features/store/hooks/business/useRotatingCoinShop/useRotatingCoinShop';
import { type CoinStoreItem } from '@/features/store/types/item';
import { type Item } from '@/types/item';

export default function Store() {
  const { theme } = useUnistyles();

  const [selectedItem, setSelectedItem] = useState<CoinStoreItem | null>(null);
  const { items, expirationDate, isLoading } = useRotatingCoinShop();

  const openDialog = (item: Item) => {
    if (item.coinPrice) setSelectedItem(item as CoinStoreItem);
  };

  const closeDialog = () => setSelectedItem(null);

  if (isLoading) return <Spinner />;

  return (
    <>
      <LinearGradient colors={theme.color.storeGradient} style={styles.container}>
        {expirationDate && (
          <LinearGradient
            {...theme.gradient.horizontal}
            colors={theme.color.blackGradient}
            style={styles.titleContainer}
          >
            <Text style={styles.title}>Items refresh in:</Text>
            <TimeCountdown date={expirationDate} style={styles.title} />
          </LinearGradient>
        )}
        <ItemList items={items} onSelect={openDialog} />
      </LinearGradient>
      {selectedItem && <PurchaseConfirmationDialog item={selectedItem} onClose={closeDialog} />}
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.none,
    gap: theme.spacing.l,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
