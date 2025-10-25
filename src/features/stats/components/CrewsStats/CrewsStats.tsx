import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { CrewsIcon } from '../../assets/images/crews';
import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';
import { LeaderboardPositionRow } from '../LeaderboardPositionStatRow/LeaderboardPositionStatRow';
import { StatRow } from '../StatRow/StatRow';

export const CrewsStats = () => {
  const { stats, isLoading } = useUserCrewsStats();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Text style={styles.title}>Crews</Text>

      {stats.position !== undefined && stats.profile && (
        <LeaderboardPositionRow
          avatarUrl={stats.profile.avatarUrl}
          elo={stats.elo}
          playerName={stats.profile.playerName}
          position={stats.position}
          rankIcon={CrewsIcon}
        />
      )}

      {stats.setStats && (
        <View style={styles.setStatsContainer}>
          <StatRow label="Crews sets" value={stats.setStats?.setCount} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  title: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 20,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  setStatsContainer: {
    gap: theme.spacing.s,
  },
}));
