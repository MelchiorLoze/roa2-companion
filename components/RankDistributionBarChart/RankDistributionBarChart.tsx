import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components';
import { useLeaderboardStats } from '@/hooks/business';
import { Rank, RANK_ELO_INTERVALS } from '@/types/rank';

// Caclulate the widths of the chart bars to be proportional to the elo intervals
const getBarWidths = (firstPlayerElo: number, lastPlayerElo: number, lastAethereanElo: number, totalWidth: number) => {
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

type Props = {
  width: number;
};

export const RankDistributionBarChart = ({ width }: Props) => {
  const {
    firstPlayerElo,
    lastPlayerElo,
    lastAethereanElo,
    rankDistribution,
    isLoading: isLoadingLeaderboard,
  } = useLeaderboardStats();

  if (isLoadingLeaderboard) return <Spinner />;

  const barWidths = getBarWidths(firstPlayerElo, lastPlayerElo, lastAethereanElo, width);

  return (
    <View testID="rank-distribution">
      <BarChart
        data={rankDistribution.reverse().map((item, index) => ({
          ...item,
          barWidth: barWidths[index] % 100,
          topLabelComponent: () => <Text style={styles.topLabel}>{item.value}</Text>,
        }))}
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
