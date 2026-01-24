import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { CrewsIcon } from '../../assets/images/crews';
import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { SeasonTitle } from '../SeasonTitle/SeasonTitle';
import { StatRow } from '../StatRow/StatRow';
import { StatsTabContentWrapper } from '../StatsTabContentWrapper/StatsTabContentWrapper';

export const CrewsStats = () => {
  const { season } = useSeason();
  const { stats, isLoading, isError, isRefreshing, refresh } = useUserCrewsStats();

  if (isLoading || isError) return <Spinner />;

  return (
    <StatsTabContentWrapper isRefreshing={isRefreshing} onRefresh={refresh} withTitle>
      <SeasonTitle seasonName={season.name} variant="crews" />

      <View style={styles.titlePadding} />

      <LeaderboardPositionRow
        avatarUrl={stats.profile.avatarUrl}
        elo={stats.elo}
        playerName={stats.profile.playerName}
        position={stats.position}
        rankIcon={CrewsIcon}
      />

      <View style={styles.statRowsContainer}>
        <StatRow label="Crews sets" value={stats.setStats.setCount} />
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
