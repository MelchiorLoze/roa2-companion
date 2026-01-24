import { type PropsWithChildren, useState } from 'react';
import { Text } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { Spinner } from '@/components/Spinner/Spinner';
import { ItemList } from '@/features/store/components/ItemList/ItemList';
import { PurchaseConfirmationDialog } from '@/features/store/components/PurchaseConfirmationDialog/PurchaseConfirmationDialog';
import { TimeCountdown } from '@/features/store/components/TimeCountdown/TimeCountdown';
import { useRotatingCoinShop } from '@/features/store/hooks/business/useRotatingCoinShop/useRotatingCoinShop';
import { type CoinStoreItem } from '@/features/store/types/item';
import { type Item } from '@/types/item';

const GradientWrapper = ({ children }: PropsWithChildren) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient {...theme.color.gradient.store} style={styles.container} vertical>
      {children}
    </LinearGradient>
  );
};

export default function Store() {
  const { theme } = useUnistyles();

  const [selectedItem, setSelectedItem] = useState<CoinStoreItem | null>(null);
  const { items, expirationDate, isLoading, isError } = useRotatingCoinShop();

  const openDialog = (item: Item) => {
    if (item.coinPrice) setSelectedItem(item as CoinStoreItem);
  };

  const closeDialog = () => setSelectedItem(null);

  if (isLoading || isError)
    return (
      <GradientWrapper>
        <Spinner />
      </GradientWrapper>
    );

  return (
    <>
      <GradientWrapper>
        <LinearGradient {...theme.color.gradient.storeCountdown} horizontal style={styles.timerContainer}>
          <Text style={styles.timer}>Items refresh in:</Text>
          <TimeCountdown date={expirationDate} style={styles.timer} />
        </LinearGradient>
        <ItemList items={items} onSelect={openDialog} />
      </GradientWrapper>
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
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    minWidth: '90%',
    padding: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    gap: theme.spacing.xs,
  },
  timer: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
