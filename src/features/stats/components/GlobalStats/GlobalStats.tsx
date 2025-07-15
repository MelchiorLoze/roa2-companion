import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';

export const GlobalStats = () => {
  const { stats, isLoading } = useUserGlobalStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <>
      <Text style={styles.title}>Global</Text>

      <View>
        <Text style={styles.label}>{stats.gameStats.gameCount} games</Text>
        <Text style={styles.label}>
          {stats.gameStats.winCount} W - {stats.gameStats.gameCount - stats.gameStats.winCount} L
        </Text>
        <Text style={styles.label}>Winrate: {(stats.gameStats.winRate ?? 0).toFixed(2)}%</Text>
      </View>
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
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
