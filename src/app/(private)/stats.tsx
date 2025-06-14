import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';
import { RankedDistributionChart } from '@/features/stats/components/RankedDistributionChart/RankedDistributionChart';
import { useUserStats } from '@/features/stats/hooks/business/useUserStats/useUserStats';
import { CHARACTER_ICONS } from '@/types/character';

type SectionProps = { title?: string } & PropsWithChildren;

const Section = ({ title, children }: SectionProps) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient colors={theme.color.statsGradient} end={[1, 0]} start={[1 / 3, 0]} style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View>{children}</View>
    </LinearGradient>
  );
};

export default function Stats() {
  const { stats, refresh, isLoading } = useUserStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isLoading} />}
    >
      <Section title="Ranked">
        <Text style={styles.label}>
          {stats.rankedSetCount} sets: {stats.rankedWinCount} W - {stats.rankedSetCount - stats.rankedWinCount} L
        </Text>
        <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
        <RankedDistributionChart elo={stats.rankedElo} position={stats.rankedPosition} rank={stats.rank} />
      </Section>

      <Section title="Global">
        <Text style={styles.label}>
          {stats.globalMatchCount} games: {stats.globalWinCount} W - {stats.globalMatchCount - stats.globalWinCount} L
        </Text>
        <Text style={styles.label}>Winrate: {(stats.globalWinRate ?? 0).toFixed(2)}%</Text>
      </Section>

      <Section>
        <View style={styles.tableRow}>
          <View style={styles.firstColumn} />
          <Text style={[styles.label, styles.otherColumns]}>Level</Text>
          <Text style={[styles.label, styles.otherColumns]}>Games</Text>
        </View>
        {stats.characterStats
          .sort((a, b) => b.level - a.level || b.gameCount - a.gameCount)
          .map((charStat) => (
            <View key={charStat.character} style={styles.tableRow}>
              <View style={styles.firstColumn}>
                <Image contentFit="contain" source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
              </View>
              <Text style={[styles.label, styles.otherColumns]}>{charStat.level}</Text>
              <Text style={[styles.label, styles.otherColumns]}>{charStat.gameCount}</Text>
            </View>
          ))}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing.l,
    gap: theme.spacing.l,
  },
  section: {
    padding: theme.spacing.s,
    gap: theme.spacing.s,
  },
  sectionTitle: {
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
  icon: {
    width: 24,
    height: 24,
  },
  tableRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstColumn: {
    flex: 1 / 5,
  },
  otherColumns: {
    flex: 2 / 5,
  },
}));
