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
  const { stats, isLoading, refresh, isRefreshing } = useUserCrewsStats();

  if (isLoading) return <Spinner />;

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

      {stats.setStats && (
        <View style={styles.setStatsContainer}>
          <StatRow label="Crews sets" value={stats.setStats?.setCount} />
        </View>
      )}
    </StatsTabContentWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  titlePadding: {
    height: theme.spacing.l,
  },
  setStatsContainer: {
    gap: theme.spacing.s,
  },
}));
