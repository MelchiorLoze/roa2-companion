import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { DoublesIcon } from '../../assets/images/doubles';
import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserDoublesStats } from '../../hooks/business/useUserDoublesStats/useUserDoublesStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { SeasonTitle } from '../SeasonTitle/SeasonTitle';
import { StatRows } from '../StatRows/StatRows';
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
      <SeasonTitle seasonName={season.name} />

      <View style={styles.titlePadding} />

      <LeaderboardPositionRow
        avatarUrl={stats.profile.avatarUrl}
        elo={stats.elo}
        playerName={stats.profile.playerName}
        position={stats.position}
        rankIcon={DoublesIcon}
      />

      <StatRows
        rows={[
          { label: '2v2 sets', value: stats.setStats.setCount },
          { label: 'Best win streak', value: stats.bestWinStreak },
        ]}
      />
    </StatsTabContentWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  titlePadding: {
    height: theme.spacing.xxl,
  },
}));
