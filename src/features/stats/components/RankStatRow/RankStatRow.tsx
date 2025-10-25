import { Canvas, FilterMode, Image as SkiaImage, useCanvasSize } from '@shopify/react-native-skia';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { OutlinedText } from '@/components/OutlinedText/OutlinedText';
import { useItemImage } from '@/hooks/business/useItemImage/useItemImage';
import { Category } from '@/types/item';

import { type Rank, RANK_ICONS } from '../../types/rank';

type Props = {
  position: number;
  avatarFriendlyId: string;
  playerName: string;
  elo?: number;
  rank?: Rank;
};

export const RankStatRow = ({ position, avatarFriendlyId, playerName, elo, rank }: Readonly<Props>) => {
  const { theme } = useUnistyles();
  const { ref: canvasRef, size: canvasSize } = useCanvasSize();

  const avatarImage = useItemImage({ friendlyId: avatarFriendlyId, category: Category.ICON });

  const filter = avatarImage && avatarImage.width() > 256 ? FilterMode.Linear : FilterMode.Nearest;

  return (
    <View style={styles.container}>
      <View style={styles.firstSeparator} />
      <LinearGradient
        colors={theme.color.rankStatPositionGradient}
        end={[1, 0]}
        start={[0, 0]}
        style={styles.labelContainer}
      >
        <Text style={styles.label}>{position}</Text>
      </LinearGradient>

      <View style={styles.secondSeparator} />
      <LinearGradient
        colors={theme.color.rankStatProfileGradient}
        end={[1, 0]}
        start={[0, 0]}
        style={[styles.labelContainer, styles.profileContainer]}
      >
        <Canvas ref={canvasRef} style={styles.playerIcon}>
          <SkiaImage
            height={canvasSize.height}
            image={avatarImage}
            sampling={{ filter }}
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
      <LinearGradient
        colors={theme.color.rankStatRankGradient}
        end={[1, 0]}
        start={[0, 0]}
        style={styles.labelContainer}
      >
        {elo !== undefined && rank ? (
          <>
            <Image contentFit="contain" source={RANK_ICONS[rank]} style={styles.rankIcon} />
            <Text style={styles.value}>{elo}</Text>
          </>
        ) : (
          <>
            <OutlinedText
              color={theme.color.white}
              fontFamily={theme.font.secondary.black}
              strokeWidth={3}
              text="UNRANKED"
            />
          </>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    boxShadow: [
      {
        color: theme.color.black,
        offsetX: 0,
        offsetY: 2,
        blurRadius: 6,
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
    flexShrink: 1,
  },
  playerIcon: {
    width: 32,
    height: 32,
  },
  value: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.stat,
  },
  rankIcon: {
    width: 24,
    height: 24,
  },
}));
