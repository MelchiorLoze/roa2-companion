import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from '@/components/IconButton/IconButton';
import { Spinner } from '@/components/Spinner/Spinner';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserStats } from '../../hooks/business/useUserStats/useUserStats';
import type { Rank } from '../../types/rank';
import { RANK_ICONS } from '../../types/rank';
import { RankedDistributionChart } from '../RankedDistributionChart/RankedDistributionChart';

export const RankedStats = () => {
  const { season, setPreviousSeason, setNextSeason } = useSeason();
  const { rankedStats: stats, isLoading } = useUserStats();

  if (!stats || isLoading) return <Spinner />;

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Ranked - {season.name}</Text>
        <View style={styles.changeSeasonContainer}>
          <IconButton
            disabled={season.isFirst}
            iconName="arrow-back"
            onPress={setPreviousSeason}
            size={24}
            style={styles.changeSeasonButton}
          />
          <Text style={styles.title}>S{season.index}</Text>
          <IconButton
            disabled={season.isLast}
            iconName="arrow-forward"
            onPress={setNextSeason}
            size={24}
            style={styles.changeSeasonButton}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.setStats && (
          <View>
            <Text style={styles.label}>
              {stats.setStats.setCount} sets: {stats.setStats.winCount} W -{' '}
              {stats.setStats.setCount - stats.setStats.winCount} L
            </Text>
            <Text style={styles.label}>Winrate: {stats.setStats.winRate.toFixed(2)}%</Text>
          </View>
        )}

        <View style={styles.positionContainer}>
          <Image contentFit="contain" source={RANK_ICONS[stats.rank]} style={styles.icon} />
          <Text style={styles.label}>
            <Text style={styles.eloLabel(stats.rank)}>{stats.elo}</Text> - #{stats.position}
          </Text>
        </View>
      </View>

      <RankedDistributionChart elo={stats.elo} />
    </>
  );
};

const styles = StyleSheet.create((theme) => ({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
  positionContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.xs,
  },
  eloLabel: (rank: Rank) => ({
    color: theme.color[rank],
  }),
  icon: {
    width: 24,
    height: 24,
  },
}));
