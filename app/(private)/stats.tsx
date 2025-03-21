import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { usePlayerStats } from '@/hooks/business';

export default function Stats() {
  const { stats, refresh, isLoading } = usePlayerStats();

  if (!stats || isLoading) return <ActivityIndicator color="white" size="large" style={styles.container} />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isLoading} />}
    >
      <View style={styles.section}>
        <Text style={styles.title}>Ranked (sets)</Text>
        <View>
          <Text style={styles.label}>Elo: {stats.rankedElo}</Text>
          <Text style={styles.label}>
            Wins: {stats.rankedWinCount} - Losses: {stats.rankedMatchCount - stats.rankedWinCount}
          </Text>
          <Text style={styles.label}>Matches: {stats.rankedMatchCount}</Text>
          <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Global (games)</Text>
        <View>
          <Text style={styles.label}>
            Wins: {stats.globalWinCount} - Losses: {stats.globalMatchCount - stats.globalWinCount}
          </Text>
          <Text style={styles.label}>Matches: {stats.globalMatchCount}</Text>
          <Text style={styles.label}>Winrate: {(stats.globalWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Per character (games)</Text>
        <View>
          <Text style={styles.label}>Clairen: {stats.claMatchCount}</Text>
          <Text style={styles.label}>Etalus: {stats.etaMatchCount}</Text>
          <Text style={styles.label}>Fleet: {stats.fleMatchCount}</Text>
          <Text style={styles.label}>Forsburn: {stats.forMatchCount}</Text>
          <Text style={styles.label}>Kragg: {stats.kraMatchCount}</Text>
          <Text style={styles.label}>Loxodont: {stats.loxMatchCount}</Text>
          <Text style={styles.label}>Maypul: {stats.mayMatchCount}</Text>
          <Text style={styles.label}>Orcane: {stats.orcMatchCount}</Text>
          <Text style={styles.label}>Ranno: {stats.ranMatchCount}</Text>
          <Text style={styles.label}>Wrastor: {stats.wraMatchCount}</Text>
          <Text style={styles.label}>Zetterburn: {stats.zetMatchCount}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  section: {
    gap: theme.spacing.s,
  },
  title: {
    fontFamily: theme.font.primary.italic,
    fontSize: 18,
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
