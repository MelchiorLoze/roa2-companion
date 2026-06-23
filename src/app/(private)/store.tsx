import { Skia } from '@shopify/react-native-skia';
import { ImageBackground } from 'expo-image';
import { type PropsWithChildren, useState } from 'react';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { CoinStoreBackground, CoinStoreTitleBackground } from '@/assets/images/ui';
import { FancyText } from '@/components/FancyText/FancyText';
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
    <View style={styles.container}>
      <ImageBackground contentFit="fill" source={CoinStoreBackground} style={StyleSheet.absoluteFill} />
      <LinearGradient {...theme.color.gradient.storeGradient} horizontal style={styles.backgroundGradient} />
      {children}
    </View>
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
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <ImageBackground contentFit="fill" source={CoinStoreTitleBackground} style={StyleSheet.absoluteFill} />
            <FancyText
              style={{
                ...styles.title,
                shadow: {
                  color: Skia.Color(theme.color.storeTitleShadow),
                  offset: { x: 1, y: 1 },
                  blurRadius: 0.001,
                },
              }}
              text="COIN SHOP"
            />
          </View>
          <CoinStoreRotationCountdown expirationDate={expirationDate} />
        </View>
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
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    top: 36,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    marginTop: -theme.spacing.s,
    padding: theme.spacing.l,
    paddingRight: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.font.secondary.black,
    fontSize: 22,
    color: theme.color.white,
    skew: -0.23,
  },
}));
