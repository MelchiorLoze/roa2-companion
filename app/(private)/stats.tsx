import { Image } from 'expo-image';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BronzeIcon, DiamondIcon, GoldIcon, MasterIcon, PlatinumIcon, SilverIcon, StoneIcon } from '@/assets/images';
import { usePlayerStats } from '@/hooks/business';
import { CHARACTER_ICONS, CHARACTER_NAMES } from '@/types/character';

const getRankIcon = (elo: number) => {
  if (elo < 500) return StoneIcon;
  if (elo < 700) return BronzeIcon;
  if (elo < 900) return SilverIcon;
  if (elo < 1100) return GoldIcon;
  if (elo < 1300) return PlatinumIcon;
  if (elo < 1500) return DiamondIcon;
  return MasterIcon;
};

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
          <View style={styles.labelWithIconContainer}>
            <Text style={styles.label}>Elo: {stats.rankedElo}</Text>
            <Image source={getRankIcon(stats.rankedElo)} style={styles.icon} />
          </View>
          <Text style={styles.label}>Matches: {stats.rankedMatchCount}</Text>
          <Text style={styles.label}>
            Wins: {stats.rankedWinCount} - Losses: {stats.rankedMatchCount - stats.rankedWinCount}
          </Text>
          <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Global (games)</Text>
        <View>
          <Text style={styles.label}>Matches: {stats.globalMatchCount}</Text>
          <Text style={styles.label}>
            Wins: {stats.globalWinCount} - Losses: {stats.globalMatchCount - stats.globalWinCount}
          </Text>
          <Text style={styles.label}>Winrate: {(stats.globalWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Per character (games)</Text>
        <View>
          {stats.gamesPlayedPerCharacter
            .sort((a, b) => b.value - a.value)
            .map((charStat) => (
              <View key={charStat.character} style={styles.labelWithIconContainer}>
                <Image source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
                <Text style={styles.label}>
                  {CHARACTER_NAMES[charStat.character]}: {charStat.value}
                </Text>
              </View>
            ))}
        </View>
      </View>
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
    gap: theme.spacing.s,
  },
  icon: {
    width: 24,
    height: 24,
  },
}));
