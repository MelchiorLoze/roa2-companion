import { type PropsWithChildren, useState } from 'react';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { Spinner } from '@/components/Spinner/Spinner';
import { CoinStoreRotationCountdown } from '@/features/store/components/CoinStoreRotationCountdown/CoinStoreRotationCountdown';
import { ItemList } from '@/features/store/components/ItemList/ItemList';
import { PurchaseConfirmationDialog } from '@/features/store/components/PurchaseConfirmationDialog/PurchaseConfirmationDialog';
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
        <CoinStoreRotationCountdown expirationDate={expirationDate} />
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
}));
