import { Canvas, Image as SkiaImage } from '@shopify/react-native-skia';
import { Image, type ImageSource } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { LinearGradient } from '@/components/LinearGradient/LinearGradient';
import { OutlinedText } from '@/components/OutlinedText/OutlinedText';
import { useCachedSkiaImage } from '@/hooks/business/useCachedSkiaImage/useCachedSkiaImage';

import { type Rank, RANK_ICONS } from '../../types/rank';

// Either rank or rankIcon or neither, but not both
type RankOrIcon = { rank?: Rank; rankIcon?: never } | { rank?: never; rankIcon?: ImageSource };

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
    <LinearGradient {...theme.color.gradient.statRow} horizontal style={styles.container}>
      <View style={styles.firstSeparator} />
      <LinearGradient {...theme.color.gradient.statPositionOverlay} horizontal style={styles.labelContainer}>
        <Text style={styles.label}>{position}</Text>
      </LinearGradient>

      <View style={styles.secondSeparator} />
      <LinearGradient
        {...theme.color.gradient.statRowOverlay}
        horizontal
        style={[styles.labelContainer, styles.profileContainer]}
      >
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
        <Text numberOfLines={1} style={styles.label}>
          {playerName}
        </Text>
      </LinearGradient>

      <View style={styles.thirdSeparator(rank)} />
      <LinearGradient {...theme.color.gradient.statRankOverlay} horizontal style={styles.labelContainer}>
        {elo !== undefined && (rank || rankIcon) ? (
          <>
            <Image contentFit="contain" source={rank ? RANK_ICONS[rank] : rankIcon} style={styles.rankIcon} />
            <Text style={styles.eloLabel(rank)}>{elo}</Text>
          </>
        ) : (
          <OutlinedText style={styles.unrankedLabel} text="UNRANKED" />
        )}
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    boxShadow: [
      {
        color: theme.color.translucentDark,
        offsetX: 0,
        offsetY: 2,
        blurRadius: 5,
        spreadDistance: 0,
      },
    ],
  },
  firstSeparator: {
    width: theme.spacing.s,
    backgroundColor: theme.color.borderDark,
  },
  secondSeparator: {
    width: theme.spacing.xs,
    backgroundColor: theme.color.borderMedium,
  },
  thirdSeparator: (rank?: Rank) => ({
    width: theme.spacing.xs,
    backgroundColor: rank ? theme.color[rank] : theme.color.borderMedium,
  }),
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
    paddingHorizontal: theme.spacing.s,
    gap: theme.spacing.xs,
  },
  label: {
    flexShrink: 1,
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  profileContainer: {
    flex: 1,
    flexShrink: 1,
  },
  playerIcon: {
    width: 32,
    height: 32,
  },
  rankIcon: {
    width: 24,
    height: 24,
  },
  eloLabel: (rank?: Rank) => ({
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: rank ? theme.color[rank] : theme.color.white,
  }),
  unrankedLabel: {
    fontFamily: theme.font.secondary.black,
    fontSize: 16,
    color: theme.color.white,
    strokeWidth: 3,
  },
}));
