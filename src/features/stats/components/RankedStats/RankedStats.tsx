import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { IconButton } from '@/components/IconButton/IconButton';
import { Spinner } from '@/components/Spinner/Spinner';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserStats } from '../../hooks/business/useUserStats/useUserStats';
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

      <View>
        <Text style={styles.label}>
          {stats.setCount} sets: {stats.winCount} W - {stats.setCount - stats.winCount} L
        </Text>
        <Text style={styles.label}>Winrate: {(stats.winRate ?? 0).toFixed(2)}%</Text>
      </View>

      <RankedDistributionChart elo={stats.elo} position={stats.position} rank={stats.rank} />
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
  label: {
    fontFamily: theme.font.primary.regular,
    fontSize: 16,
    color: theme.color.white,
    textTransform: 'uppercase',
  },
}));
