import type { ComponentProps } from 'react';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from '@/components/IconButton/IconButton';
import { Spinner } from '@/components/Spinner/Spinner';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserRankedStats } from '../../hooks/business/useUserRankedStats/useUserRankedStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { RankedDistributionChart } from '../RankedDistributionChart/RankedDistributionChart';
import { SeasonTitle } from '../SeasonTitle/SeasonTitle';
import { StatRows } from '../StatRows/StatRows';
import { StatsTabContentWrapper } from '../StatsTabContentWrapper/StatsTabContentWrapper';

export const RankedStats = () => {
  const { season, setPreviousSeason, setNextSeason, isLoading: isLoadingSeason, isError: isErrorSeason } = useSeason();
  const {
    stats,
    isLoading: isLoadingRankedStats,
    isError: isErrorRankedStats,
    isRefreshing,
    refresh,
  } = useUserRankedStats();

  if (isLoadingSeason || isLoadingRankedStats || isErrorSeason || isErrorRankedStats) return <Spinner />;

  const statRows: ComponentProps<typeof StatRows>['rows'] = [{ label: 'Best win streak', value: stats.bestWinStreak }];

  if (stats.setStats) {
    statRows.unshift(
      { label: 'Ranked wins', value: stats.setStats.winCount },
      { label: 'Ranked losses', value: stats.setStats.setCount - stats.setStats.winCount },
      { label: 'Ranked win rate', value: stats.setStats.winRate.toFixed(2) + '%' },
    );
  }

  return (
    <StatsTabContentWrapper isRefreshing={isRefreshing} onRefresh={refresh} withTitle>
      <SeasonTitle seasonName={season.name} />

      <View style={styles.changeSeasonContainer}>
        <IconButton
          disabled={season.isFirst}
          iconName="arrow-back"
          onPress={setPreviousSeason}
          size={24}
          style={styles.changeSeasonButton}
        />
        <Text style={styles.seasonLabel}>S{season.index}</Text>
        <IconButton
          disabled={season.isLast}
          iconName="arrow-forward"
          onPress={setNextSeason}
          size={24}
          style={styles.changeSeasonButton}
        />
      </View>

      <LeaderboardPositionRow
        avatarUrl={stats.profile.avatarUrl}
        elo={stats.elo}
        playerName={stats.profile.playerName}
        position={stats.position}
        rank={stats.rank}
      />

      <View>
        <RankedDistributionChart elo={stats.elo} />
        {stats.elo !== undefined && stats.rank && Boolean(stats.playerCount) && (
          <Text style={styles.percentageLabel}>Top {((stats.position / stats.playerCount) * 100).toFixed(2)}%</Text>
        )}
      </View>

      <StatRows rows={statRows} />
    </StatsTabContentWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  changeSeasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  seasonLabel: {
    fontFamily: theme.font.primary.bold,
    fontSize: 20,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  changeSeasonButton: {
    padding: theme.spacing.xxs,
  },
  percentageLabel: {
    fontFamily: theme.font.primary.bold,
    fontSize: 14,
    color: theme.color.white,
    textTransform: 'uppercase',
    position: 'absolute',
    right: 0,
    top: theme.spacing.l,
  },
}));
