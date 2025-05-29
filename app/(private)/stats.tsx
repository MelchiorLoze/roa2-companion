import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Spinner } from '@/components';
import { useUserStats } from '@/hooks/business';
import { useLeaderboardStats } from '@/hooks/business/useLeaderboardStats/useLeaderboardStats';
import { CHARACTER_ICONS } from '@/types/character';
import { Rank, RANK_ICONS } from '@/types/stats';

const getBarWidths = (firstPlayerElo: number, lastAethereanElo: number, totalWidth: number) => [
  ((500 - 0) / firstPlayerElo) * totalWidth, // Stone: 0 to 500
  ((700 - 500) / firstPlayerElo) * totalWidth, // Bronze: 500 to 700
  ((900 - 700) / firstPlayerElo) * totalWidth, // Silver: 700 to 900
  ((1100 - 900) / firstPlayerElo) * totalWidth, // Gold: 900 to 1100
  ((1300 - 1100) / firstPlayerElo) * totalWidth, // Platinum: 1100 to 1300
  ((1500 - 1300) / firstPlayerElo) * totalWidth, // Diamond: 1300 to 1500
  ((1700 - 1500) / firstPlayerElo) * totalWidth, // Master: 1500 to 1700
  ((lastAethereanElo - 1700) / firstPlayerElo) * totalWidth, // Grandmaster: 1700 to minAetherianElo
  ((firstPlayerElo - lastAethereanElo) / firstPlayerElo) * totalWidth, // Aetherian: minAetherianElo to maxElo
];

type ChartProps = {
  width: number;
};

const RankDistributionBarChart = ({ width }: ChartProps) => {
  const { firstPlayerElo, lastAethereanElo, rankDistribution, isLoading: isLoadingLeaderboard } = useLeaderboardStats();

  if (isLoadingLeaderboard) return <Spinner />;

  const barWidths = getBarWidths(firstPlayerElo, lastAethereanElo, width);

  return (
    <BarChart
      data={rankDistribution.reverse().map((item, index) => ({
        ...item,
        barWidth: barWidths[index] % 100,
        topLabelComponent: () => <Text style={styles.chartBarTopLabel}>{item.value}</Text>,
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
  );
};

const EloDistributionLineChart = ({ width }: ChartProps) => {
  const { eloDistribution, isLoading: isLoadingLeaderboard } = useLeaderboardStats();

  if (isLoadingLeaderboard) return null;

  return (
    <View style={styles.lineChartContainer}>
      <LineChart
        adjustToWidth
        data={eloDistribution}
        dataPointsColor="transparent"
        dataPointsRadius={2}
        disableScroll
        height={width}
        hideAxesAndRules
        initialSpacing={0}
        thickness={1}
        width={width}
        xAxisLabelsHeight={0}
        yAxisLabelWidth={0}
      />
    </View>
  );
};

type SectionProps = { title?: string } & PropsWithChildren;

const Section = ({ title, children }: SectionProps) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient colors={theme.color.statsGradient} end={[1, 0]} start={[1 / 3, 0]} style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View>{children}</View>
    </LinearGradient>
  );
};

export default function Stats() {
  const { stats, refresh, isLoading } = useUserStats();
  const dimensions = useWindowDimensions();
  const width = dimensions.width - 2 * 24;

  if (!stats || isLoading) return <Spinner />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isLoading} />}
    >
      <Section title="Ranked">
        <Text style={styles.label}>
          {stats.rankedSetCount} sets: {stats.rankedWinCount} W - {stats.rankedSetCount - stats.rankedWinCount} L
        </Text>
        <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
        <View>
          <View style={styles.labelWithIconContainer}>
            <Image contentFit="contain" source={RANK_ICONS[stats.rank]} style={styles.icon} />
            <Text style={[styles.label, styles.eloLabel(stats.rank)]}>{stats.rankedElo}</Text>
            <Text style={styles.label}>- #{stats.rankedPosition}</Text>
          </View>
          <RankDistributionBarChart width={width} />
          <EloDistributionLineChart width={width} />
        </View>
      </Section>

      <Section title="Global">
        <Text style={styles.label}>
          {stats.globalMatchCount} games: {stats.globalWinCount} W - {stats.globalMatchCount - stats.globalWinCount} L
        </Text>
        <Text style={styles.label}>Winrate: {(stats.globalWinRate ?? 0).toFixed(2)}%</Text>
      </Section>

      <Section>
        <View style={styles.tableRow}>
          <View style={styles.firstColumn} />
          <Text style={[styles.label, styles.otherColumns]}>Level</Text>
          <Text style={[styles.label, styles.otherColumns]}>Games</Text>
        </View>
        {stats.characterStats
          .sort((a, b) => b.level - a.level || b.gameCount - a.gameCount)
          .map((charStat) => (
            <View key={charStat.character} style={styles.tableRow}>
              <View style={styles.firstColumn}>
                <Image contentFit="contain" source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
              </View>
              <Text style={[styles.label, styles.otherColumns]}>{charStat.level}</Text>
              <Text style={[styles.label, styles.otherColumns]}>{charStat.gameCount}</Text>
            </View>
          ))}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  section: {
    padding: theme.spacing.s,
    gap: theme.spacing.s,
  },
  sectionTitle: {
    fontFamily: theme.font.primary.italic,
    fontSize: 18,
    color: theme.color.white,
    textTransform: 'uppercase',
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
  labelWithIconContainer: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tableRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstColumn: {
    flex: 1 / 5,
  },
  otherColumns: {
    flex: 2 / 5,
  },
  chartBarTopLabel: {
    fontFamily: theme.font.secondary.black,
    fontSize: 10,
    color: theme.color.black,
  },
  lineChartContainer: {
    position: 'absolute',
  },
}));
