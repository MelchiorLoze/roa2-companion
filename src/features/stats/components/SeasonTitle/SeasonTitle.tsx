import { ImageBackground } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { CoinStoreTitleBackground } from '@/assets/images/ui';
import { FancyText } from '@/components/FancyText/FancyText';

type Props = {
  seasonName: string;
};

export const SeasonTitle = ({ seasonName }: Readonly<Props>) => {
  return (
    <View style={styles.container}>
      <ImageBackground contentFit="fill" source={CoinStoreTitleBackground} style={StyleSheet.absoluteFill} />

      <FancyText style={styles.title} text={seasonName} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    padding: theme.spacing.xl,
    paddingTop: 20,
    width: '70%',
    top: 0,
    left: 0,
    transform: [{ translateY: '-40%' }],
  },
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 22,
    textTransform: 'uppercase',
    skew: -0.15,
    color: theme.color.white,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.l,
  },
}));
