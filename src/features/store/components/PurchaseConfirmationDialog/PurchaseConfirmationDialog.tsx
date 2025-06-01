import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button, Dialog, Spinner } from '@/components';
import { CurrencyId } from '@/types/currency';
import { CATEGORY_LABELS } from '@/types/item';

import { usePurchaseInventoryItems } from '../../hooks/data/usePurchaseInventoryItems/usePurchaseInventoryItems';
import type { CoinStoreItem } from '../../types/item';

type Props = {
  item: CoinStoreItem;
  onClose: () => void;
};

const Content = ({ item, onClose }: Props) => {
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
        <Text style={styles.title}>
          An error occurred while trying to purchase the item. Do you have enought funds?
        </Text>
        <View style={styles.buttonContainer}>
          <Button label="Retry" onPress={handlePurchase} />
          <Button label="Cancel" onPress={onClose} />
        </View>
      </>
    );
  }

  return (
    <>
      <Text style={styles.title}>
        Are you sure you want to buy the {CATEGORY_LABELS[item.category]} {item.name} for {item.coinPrice}?
      </Text>
      <View style={styles.buttonContainer}>
        <Button label="Yes" onPress={handlePurchase} />
        <Button label="No" onPress={onClose} />
      </View>
    </>
  );
};

export const PurchaseConfirmationDialog = ({ item, onClose }: Props) => {
  return (
    <Dialog onClose={onClose}>
      <Content item={item} onClose={onClose} />
    </Dialog>
  );
};

const styles = StyleSheet.create((theme) => ({
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
