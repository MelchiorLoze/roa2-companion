import { Image } from 'expo-image';
import { Text, useWindowDimensions, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { type Rank, RANK_ICONS } from '../../types/rank';
import { EloDistributionLineChart } from '../EloDistributionLineChart/EloDistributionLineChart';
import { RankDistributionBarChart } from '../RankDistributionBarChart/RankDistributionBarChart';

type Props = {
  rank: Rank;
  elo: number;
  position: number;
};

export const RankedDistributionChart = ({ rank, elo, position }: Props) => {
  const dimensions = useWindowDimensions();
  const width = dimensions.width - 2 * 24;

  return (
    <View>
      <View style={styles.labelWithIconContainer}>
        <Image contentFit="contain" source={RANK_ICONS[rank]} style={styles.icon} />
        <Text style={styles.label}>
          <Text style={styles.eloLabel(rank)}>{elo}</Text> - #{position}
        </Text>
      </View>
      <RankDistributionBarChart width={width} />
      <EloDistributionLineChart style={styles.lineChartContainer} userElo={elo} width={width} />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  labelWithIconContainer: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  eloLabel: (rank: Rank) => ({
    color: theme.color[rank],
  }),
  icon: {
    width: 24,
    height: 24,
  },
  lineChartContainer: {
    position: 'absolute',
  },
}));
