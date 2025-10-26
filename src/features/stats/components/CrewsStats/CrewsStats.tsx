import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { CrewsIcon } from '../../assets/images/crews';
import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { SeasonTitle } from '../SeasonTitle/SeasonTitle';
import { StatRow } from '../StatRow/StatRow';

export const CrewsStats = () => {
  const { season } = useSeason();
  const { stats, isLoading } = useUserCrewsStats();

  if (isLoading) return <Spinner />;

  return (
    <>
      <SeasonTitle seasonName={`Crews - ${season.name}`} variant="crews" />

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
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  titlePadding: {
    height: 28,
  },
  setStatsContainer: {
    gap: theme.spacing.s,
  },
}));
