import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Spinner } from '@/components/Spinner/Spinner';
import { CHARACTER_ICONS } from '@/types/character';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';
import { StatRow } from '../StatRow/StatRow';
import { StatsTabContentWrapper } from '../StatsTabContentWrapper/StatsTabContentWrapper';

export const GlobalStats = () => {
  const { stats, isLoading, isError, refresh, isRefreshing } = useUserGlobalStats();

  if (isLoading || isError) return <Spinner />;

  return (
    <StatsTabContentWrapper isRefreshing={isRefreshing} onRefresh={refresh}>
      <View style={styles.statRowsContainer}>
        <StatRow label="Global wins" value={stats.gameStats.winCount} />
        <StatRow label="Global losses" value={stats.gameStats.gameCount - stats.gameStats.winCount} />
        <StatRow label="Global win rate" value={stats.gameStats.winRate.toFixed(2) + '%'} />
      </View>

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
    </StatsTabContentWrapper>
  );
};

const styles = StyleSheet.create((theme) => ({
  statRowsContainer: {
    gap: theme.spacing.s,
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
    borderColor: theme.color.stat,
  }),
  firstColumn: {
    flex: 1 / 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherColumns: {
    flex: 2 / 5,
    paddingLeft: theme.spacing.s,
    borderLeftWidth: 2,
    borderColor: theme.color.stat,
  },
}));
