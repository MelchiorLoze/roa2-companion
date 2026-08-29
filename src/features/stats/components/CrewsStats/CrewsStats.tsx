import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { CrewsIcon } from '../../assets/images/crews';
import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { SeasonTitle } from '../SeasonTitle/SeasonTitle';
import { StatRows } from '../StatRows/StatRows';
import { StatsTabContentWrapper } from '../StatsTabContentWrapper/StatsTabContentWrapper';

export const CrewsStats = () => {
  const { season, isLoading: isLoadingSeason, isError: isErrorSeason } = useSeason();
  const {
    stats,
    isLoading: isLoadingCrewsStats,
    isError: isErrorCrewsStats,
    isRefreshing,
    refresh,
  } = useUserCrewsStats();

  if (isLoadingSeason || isLoadingCrewsStats || isErrorSeason || isErrorCrewsStats) return <Spinner />;

  return (
    <StatsTabContentWrapper isRefreshing={isRefreshing} onRefresh={refresh} withTitle>
      <SeasonTitle seasonName={season.name} />

      <View style={styles.titlePadding} />

      <LeaderboardPositionRow
        avatarUrl={stats.profile.avatarUrl}
        elo={stats.elo}
        playerName={stats.profile.playerName}
        position={stats.position}
        rankIcon={CrewsIcon}
      />

      <StatRows
        rows={[
          { label: 'Crews sets', value: stats.setStats.setCount },
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
