import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/components/Button/Button';
import { Dialog } from '@/components/Dialog/Dialog';
import { Spinner } from '@/components/Spinner/Spinner';
import { CurrencyId } from '@/types/currency';
import { CATEGORY_LABELS } from '@/types/item';

import { usePurchaseInventoryItems } from '../../hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import { type CoinStoreItem } from '../../types/item';

type Props = {
  item: CoinStoreItem;
  onClose: () => void;
};

const Content = ({ item, onClose }: Readonly<Props>) => {
  const { purchase, isLoading, isError } = usePurchaseInventoryItems({ onSuccess: onClose });

  const handlePurchase = () => {
    purchase({
      id: item.id,
      price: { value: item.coinPrice, currencyId: CurrencyId.COINS },
    });
  };

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.body}>An error occurred while trying to purchase this item. Do you have enough funds?</Text>
        <View style={styles.buttonContainer}>
          <Button label="Cancel" onPress={onClose} />
          <Button label="Retry" onPress={handlePurchase} />
        </View>
      </>
    );
  }

  return (
    <>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.body}>
        Are you sure you want to buy this {CATEGORY_LABELS[item.category]} for {item.coinPrice}?
      </Text>
      <View style={styles.buttonContainer}>
        <Button label="Close" onPress={onClose} />
        <Button label="Confirm" onPress={handlePurchase} />
      </View>
    </>
  );
};

export const PurchaseConfirmationDialog = ({ item, onClose }: Readonly<Props>) => {
  return (
    <Dialog alertText="If you have the game opened, don't try to buy the same item twice" onClose={onClose}>
      <Content item={item} onClose={onClose} />
    </Dialog>
  );
};

const styles = StyleSheet.create((theme) => ({
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 24,
    color: theme.color.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  body: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
}));
