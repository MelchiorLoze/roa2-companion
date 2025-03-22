import { Image } from 'expo-image';
import { PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

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

type SectionProps = { title: string } & PropsWithChildren;

const Section = ({ title, children }: SectionProps) => (
  <View style={styles.section}>
    <Text style={styles.title}>{title}</Text>
    <View>{children}</View>
  </View>
);

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
          <Image source={getRankIcon(stats.rankedElo)} style={styles.icon} />
          <Text style={styles.label}>{stats.rankedElo}</Text>
        </View>
        <Text style={styles.label}>{stats.rankedMatchCount} sets</Text>
        <Text style={styles.label}>
          {stats.rankedWinCount} wins - {stats.rankedMatchCount - stats.rankedWinCount} losses
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

      <Section title="Per character (games)">
        {stats.gamesPlayedPerCharacter
          .sort((a, b) => b.value - a.value)
          .map((charStat) => (
            <View key={charStat.character} style={styles.labelWithIconContainer}>
              <Image source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
              <Text style={styles.label}>{charStat.value}</Text>
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
  labelWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  icon: {
    width: 24,
    height: 24,
  },
}));
