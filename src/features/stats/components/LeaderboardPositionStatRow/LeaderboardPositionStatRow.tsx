import { Canvas, Image as SkiaImage } from '@shopify/react-native-skia';
import { Image, type ImageSource } from 'expo-image';
import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LeaderboardRowBackground, PlayerIconContainerBackground } from '@/assets/images/ui';
import { FancyText } from '@/components/FancyText/FancyText';
import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { NineSlicesImage } from '@/components/NineSlicesImage/NineSlicesImage';
import { useCachedSkiaImage } from '@/hooks/business/useCachedSkiaImage/useCachedSkiaImage';

import { type Rank, RANK_ICONS } from '../../types/rank';

// Either rank or rankIcon or neither, but not both
type RankOrIcon = Either<{ rank?: Rank }, { rankIcon?: ImageSource }>;

type Props = {
  position: number;
  avatarUrl: URL;
  playerName: string;
  elo?: number;
} & RankOrIcon;

export const LeaderboardPositionRow = ({ position, avatarUrl, playerName, elo, rank, rankIcon }: Readonly<Props>) => {
  const { theme } = useUnistyles();
  const { image: avatarImage, canvasRef, canvasSize, canvasFilter } = useCachedSkiaImage(avatarUrl);

  return (
    <View style={styles.container}>
      <NineSlicesImage
        insets={{ top: '49%', right: '40%', bottom: '49%', left: '40%' }}
        source={LeaderboardRowBackground}
        style={styles.rowBackground}
      />

      <View style={styles.leftContainer}>
        <LinearGradient {...theme.color.gradient.leaderboardLeftGradient} horizontal style={styles.positionContainer}>
          <FancyText
            style={{
              ...styles.label,
              gradient: { ...theme.color.gradient.labelText(), direction: 'vertical' },
            }}
            text={position.toString()}
          />
        </LinearGradient>

        <View style={styles.iconContainer}>
          <NineSlicesImage
            insets={{ top: '40%', right: '40%', bottom: '40%', left: '40%' }}
            source={PlayerIconContainerBackground}
            style={styles.iconBackground}
          />
          <Canvas ref={canvasRef} style={styles.playerIcon}>
            <SkiaImage
              height={canvasSize.height}
              image={avatarImage}
              sampling={{ filter: canvasFilter }}
              width={canvasSize.width}
              x={0}
              y={0}
            />
          </Canvas>
        </View>

        <LinearGradient
          {...theme.color.gradient.leaderboardRightGradient}
          horizontal
          style={styles.playerNameContainer}
        >
          <FancyText
            style={{
              ...styles.label,
              gradient: { ...theme.color.gradient.labelText(), direction: 'vertical' },
            }}
            text={playerName}
          />
        </LinearGradient>
      </View>

      <View style={styles.eloContainer}>
        {(rank ?? rankIcon) && (
          <Image contentFit="contain" source={rank ? RANK_ICONS[rank] : rankIcon} style={styles.rankIcon} />
        )}
        <FancyText style={{ ...styles.label, ...styles.eloLabel(rank) }} text={elo?.toString() ?? 'UNRANKED'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing.l,
    paddingLeft: theme.spacing.s,
    justifyContent: 'space-between',
  },
  rowBackground: {
    ...StyleSheet.absoluteFillObject,
    margin: -theme.spacing.l,
    marginHorizontal: -theme.spacing.m,
  },
  label: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 16,
    textTransform: 'uppercase',
    strokeWidth: 1.5,
    strokeColor: theme.color.leaderboardLabelOutline,
  },
  leftContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionContainer: {
    paddingRight: theme.spacing.s,
    marginLeft: theme.spacing.s,
    paddingVertical: 6,
    minWidth: 25,
  },
  iconContainer: {
    marginHorizontal: theme.spacing.xs,
  },
  iconBackground: {
    ...StyleSheet.absoluteFillObject,
    margin: -theme.spacing.l,
  },
  playerIcon: {
    width: 38 * runtime.fontScale,
    aspectRatio: 1,
  },
  playerNameContainer: {
    flexShrink: 1,
    overflow: 'hidden',
    paddingLeft: theme.spacing.s,
    marginRight: theme.spacing.s,
    paddingVertical: 6,
  },
  eloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xxs,
  },
  rankIcon: {
    height: 22 * runtime.fontScale,
    aspectRatio: 1,
  },
  eloLabel: (rank?: Rank) => ({
    color: rank ? theme.color[rank] : theme.color.white,
    strokeColor: theme.color.black,
  }),
}));
