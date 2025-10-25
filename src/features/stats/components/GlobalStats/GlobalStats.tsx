import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';
import { StatRow } from '../StatRow/StatRow';

export const GlobalStats = () => {
  const { stats, isLoading } = useUserGlobalStats();

  if (isLoading) return <Spinner />;

  return (
    <>
      <Text style={styles.title}>Global</Text>

      {stats.gameStats && (
        <View style={styles.gameStatsContainer}>
          <StatRow label="Global wins" value={stats.gameStats?.winCount} />
          <StatRow label="Global losses" value={stats.gameStats.gameCount - stats.gameStats.winCount} />
          <StatRow label="Global win rate" value={stats.gameStats?.winRate.toFixed(2) + '%'} />
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
  gameStatsContainer: {
    gap: theme.spacing.s,
  },
}));
