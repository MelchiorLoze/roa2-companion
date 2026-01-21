import { Text, View } from 'react-native';
import { BarChart, type barDataItem } from 'react-native-gifted-charts';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { useLeaderboardStats } from '../../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useRankDistribution } from '../../../hooks/business/useRankDistribution/useRankDistribution';
import { Rank, RANK_ELO_INTERVALS } from '../../../types/rank';

const formatNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

// Calculate the widths of the chart bars to be proportional to the elo intervals
const getBarWidths = (
  firstPlayerElo: number,
  lastPlayerElo: number,
  lastAethereanElo: number,
  totalWidth: number,
): number[] => {
  const totalEloRange = firstPlayerElo - lastPlayerElo + 1;
  return [
    RANK_ELO_INTERVALS[Rank.STONE].max - lastPlayerElo + 1, // Assuming there could be players below 0 elo
    RANK_ELO_INTERVALS[Rank.BRONZE].size(),
    RANK_ELO_INTERVALS[Rank.SILVER].size(),
    RANK_ELO_INTERVALS[Rank.GOLD].size(),
    RANK_ELO_INTERVALS[Rank.PLATINUM].size(),
    RANK_ELO_INTERVALS[Rank.DIAMOND].size(),
    RANK_ELO_INTERVALS[Rank.MASTER].size(),
    lastAethereanElo - RANK_ELO_INTERVALS[Rank.GRANDMASTER].min + 1,
    firstPlayerElo - lastAethereanElo,
  ].map((eloIntervalSize) => (eloIntervalSize / totalEloRange) * totalWidth);
};

const formatBarData = (rawData: Record<Rank, number>, barWidths: number[], theme: Theme): barDataItem[] =>
  Object.entries(rawData).map(([rank, count], index) => ({
    value: count,
    frontColor: theme.color[rank as Rank],
    barWidth: barWidths[index],
    topLabelComponent: () => <Text style={styles.topLabel}>{formatNumber(count)}</Text>,
  }));

type Props = {
  width: number;
};

export const RankDistributionBarChart = ({ width }: Readonly<Props>) => {
  const {
    firstPlayerElo,
    lastPlayerElo,
    lastAethereanElo,
    isLoading: isLoadingLeaderboardStats,
    isError: isErrorLeaderboardStats,
  } = useLeaderboardStats();
  const {
    rankDistribution,
    isLoading: isLoadingRankDistribution,
    isError: isErrorRankDistribution,
  } = useRankDistribution();
  const { theme } = useUnistyles();

  if (isLoadingLeaderboardStats || isErrorLeaderboardStats || isLoadingRankDistribution || isErrorRankDistribution)
    return (
      <View style={{ height: width }}>
        <Spinner />
      </View>
    );

  const barWidths = getBarWidths(firstPlayerElo, lastPlayerElo, lastAethereanElo, width);

  return (
    <View testID="rank-distribution">
      <BarChart
        data={formatBarData(rankDistribution, barWidths, theme)}
        disablePress
        disableScroll
        height={width}
        hideAxesAndRules
        spacing={0}
        width={width}
        xAxisLabelsHeight={0}
        yAxisLabelWidth={0}
      />
    </View>
  );
};

const styles = StyleSheet.create((theme) => ({
  topLabel: {
    fontFamily: theme.font.secondary.black,
    fontSize: 10,
    color: theme.color.black,
  },
}));
