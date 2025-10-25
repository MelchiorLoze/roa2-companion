import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from '@/components/IconButton/IconButton';
import { Spinner } from '@/components/Spinner/Spinner';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserRankedStats } from '../../hooks/business/useUserRankedStats/useUserRankedStats';
import { RankedDistributionChart } from '../RankedDistributionChart/RankedDistributionChart';
import { RankStatRow } from '../RankStatRow/RankStatRow';
import { StatRow } from '../StatRow/StatRow';

export const RankedStats = () => {
  const { season, setPreviousSeason, setNextSeason } = useSeason();
  const { stats, isLoading } = useUserRankedStats();

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

      <RankStatRow
        avatarUrl={stats.profile.avatarUrl}
        elo={stats.elo}
        playerName={stats.profile.playerName}
        position={stats.position}
        rank={stats.rank}
      />

      {stats.bestWinStreak !== undefined && (
        <View style={styles.setStatsContainer}>
          {stats.setStats && (
            <>
              <StatRow label="Ranked wins" value={stats.setStats?.winCount} />
              <StatRow label="Ranked losses" value={stats.setStats.setCount - stats.setStats.winCount} />
              <StatRow label="Ranked win rate" value={stats.setStats?.winRate.toFixed(2) + '%'} />
            </>
          )}
          <StatRow label="Best win streak" value={stats.bestWinStreak} />
        </View>
      )}

      {Boolean(stats.playerCount) && (
        <Text style={styles.percentageLabel}>Top {((stats.position / stats.playerCount) * 100).toFixed(2)}%</Text>
      )}

      <RankedDistributionChart elo={stats.elo} />
    </>
  );
};

const styles = StyleSheet.create((theme, runtime) => ({
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
  setStatsContainer: {
    gap: theme.spacing.s,
  },
  percentageLabel: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
    position: 'absolute',
    right: theme.spacing.s,
    bottom: runtime.screen.width - 2 * theme.spacing.xl,
  },
}));
