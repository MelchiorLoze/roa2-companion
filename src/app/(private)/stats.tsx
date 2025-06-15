import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type PropsWithChildren } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { IconButton } from '@/components/IconButton/IconButton';
import { Spinner } from '@/components/Spinner/Spinner';
import { RankedDistributionChart } from '@/features/stats/components/RankedDistributionChart/RankedDistributionChart';
import { useSeason } from '@/features/stats/contexts/SeasonContext/SeasonContext';
import { useUserStats } from '@/features/stats/hooks/business/useUserStats/useUserStats';
import { CHARACTER_ICONS } from '@/types/character';

const Section = ({ children }: PropsWithChildren) => {
  const { theme } = useUnistyles();

  return (
    <LinearGradient colors={theme.color.statsGradient} end={[1, 0]} start={[1 / 3, 0]} style={styles.section}>
      {children}
    </LinearGradient>
  );
};

export default function Stats() {
  const { season, setPreviousSeason, setNextSeason } = useSeason();
  const { stats, refresh, isLoading } = useUserStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl onRefresh={refresh} refreshing={isLoading} />}
    >
      <Section>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Ranked - {season.name}</Text>
          <View style={styles.changeSeasonContainer}>
            <IconButton
              disabled={season.isFirst}
              iconName="arrow-back"
              onPress={setPreviousSeason}
              size={24}
              style={styles.changeSeasonButton}
            />
            <Text style={styles.sectionTitle}>S{season.index}</Text>
            <IconButton
              disabled={season.isLast}
              iconName="arrow-forward"
              onPress={setNextSeason}
              size={24}
              style={styles.changeSeasonButton}
            />
          </View>
        </View>
        <View>
          <Text style={styles.label}>
            {stats.rankedSetCount} sets: {stats.rankedWinCount} W - {stats.rankedSetCount - stats.rankedWinCount} L
          </Text>
          <Text style={styles.label}>Winrate: {(stats.rankedWinRate ?? 0).toFixed(2)}%</Text>
        </View>
        <RankedDistributionChart elo={stats.rankedElo} position={stats.rankedPosition} rank={stats.rank} />
      </Section>

      <Section>
        <Text style={styles.sectionTitle}>Global</Text>
        <View>
          <Text style={styles.label}>
            {stats.globalGameCount} games: {stats.globalWinCount} W - {stats.globalGameCount - stats.globalWinCount} L
          </Text>
          <Text style={styles.label}>Winrate: {(stats.globalWinRate ?? 0).toFixed(2)}%</Text>
        </View>
      </Section>

      <Section>
        <Text style={styles.sectionTitle}>Characters</Text>
        <View>
          <View style={styles.tableRow()}>
            <View style={styles.firstColumn} />
            <Text style={[styles.label, styles.otherColumns]}>Level</Text>
            <Text style={[styles.label, styles.otherColumns]}>Games</Text>
          </View>
          {stats.characterStats
            .sort((a, b) => b.level - a.level || b.gameCount - a.gameCount)
            .map((charStat, index) => (
              <View key={charStat.character} style={styles.tableRow(index === stats.characterStats.length - 1)}>
                <View style={styles.firstColumn}>
                  <Image contentFit="contain" source={CHARACTER_ICONS[charStat.character]} style={styles.icon} />
                </View>
                <Text style={[styles.label, styles.otherColumns]}>{charStat.level}</Text>
                <Text style={[styles.label, styles.otherColumns]}>{charStat.gameCount}</Text>
              </View>
            ))}
        </View>
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
  sectionTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: theme.font.secondary.bold,
    fontSize: 20,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  changeSeasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeSeasonButton: {
    padding: theme.spacing.xxs,
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
  tableRow: (isLast?: boolean) => ({
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: isLast ? 0 : 1,
    borderColor: theme.color.accent,
  }),
  firstColumn: {
    flex: 1 / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherColumns: {
    flex: 2 / 5,
    paddingLeft: theme.spacing.s,
    borderLeftWidth: 1,
    borderColor: theme.color.accent,
  },
}));
