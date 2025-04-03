import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { BronzeIcon, DiamondIcon, GoldIcon, MasterIcon, PlatinumIcon, SilverIcon, StoneIcon } from '@/assets/images';
import { Spinner } from '@/components';
import { usePlayerStats } from '@/hooks/business';
import { CHARACTER_ICONS } from '@/types/character';

const getRankIcon = (elo: number) => {
  if (elo < 500) return StoneIcon;
  if (elo < 700) return BronzeIcon;
  if (elo < 900) return SilverIcon;
  if (elo < 1100) return GoldIcon;
  if (elo < 1300) return PlatinumIcon;
  if (elo < 1500) return DiamondIcon;
  return MasterIcon;
};

type SectionProps = { title?: string } & PropsWithChildren;

const Section = ({ title, children }: SectionProps) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient colors={theme.color.labelGradient(true)} end={[1, 0]} start={[0, 0]} style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.sectionContent}>{children}</View>
    </LinearGradient>
  );
};

export default function Stats() {
  const { stats, refresh, isLoading } = usePlayerStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isLoading} />}
    >
      <Section title="Ranked">
        <View style={styles.labelWithIconContainer}>
          <Image contentFit="contain" source={getRankIcon(stats.rankedElo)} style={styles.icon} />
          <Text style={styles.label}>{stats.rankedElo}</Text>
        </View>
        <Text style={styles.label}>{stats.rankedSetCount} sets</Text>
        <Text style={styles.label}>
          {stats.rankedWinCount} wins - {stats.rankedSetCount - stats.rankedWinCount} losses
        </Text>
        <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
      </Section>

      <Section title="Global">
        <Text style={styles.label}>{stats.globalMatchCount} games</Text>
        <Text style={styles.label}>
          {stats.globalWinCount} wins - {stats.globalMatchCount - stats.globalWinCount} losses
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
  sectionContent: {
    width: '75%',
    alignItems: 'center',
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
  labelWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
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
