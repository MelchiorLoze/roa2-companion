import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { DoublesIcon } from '../../assets/images/doubles';
import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserDoublesStats } from '../../hooks/business/useUserDoublesStats/useUserDoublesStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { SeasonTitle } from '../SeasonTitle/SeasonTitle';
import { StatRow } from '../StatRow/StatRow';
import { StatsTabContentWrapper } from '../StatsTabContentWrapper/StatsTabContentWrapper';

export const DoublesStats = () => {
  const { season, isLoading: isLoadingSeason, isError: isErrorSeason } = useSeason();
  const {
    stats,
    isLoading: isLoadingDoublesStats,
    isError: isErrorDoublesStats,
    isRefreshing,
    refresh,
  } = useUserDoublesStats();

  if (isLoadingSeason || isLoadingDoublesStats || isErrorSeason || isErrorDoublesStats) return <Spinner />;

  return (
    <StatsTabContentWrapper isRefreshing={isRefreshing} onRefresh={refresh} withTitle>
      <SeasonTitle seasonName={season.name} variant="doubles" />

      <View style={styles.titlePadding} />

      <LeaderboardPositionRow
        avatarUrl={stats.profile.avatarUrl}
        elo={stats.elo}
        playerName={stats.profile.playerName}
        position={stats.position}
        rankIcon={DoublesIcon}
      />

      <View style={styles.statRowsContainer}>
        <StatRow label="2v2 sets" value={stats.setStats.setCount} />
        <StatRow label="Best win streak" value={stats.bestWinStreak} />
      </View>
    </StatsTabContentWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  titlePadding: {
    height: theme.spacing.l,
  },
  statRowsContainer: {
    gap: theme.spacing.s,
  },
}));
