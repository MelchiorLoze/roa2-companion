import { useMemo } from 'react';
import { barDataItem, lineDataItem } from 'react-native-gifted-charts';
import { useUnistyles } from 'react-native-unistyles';

import { useCommunityLeaderboard, useCommunityLeaderboards } from '@/hooks/data';
import { getRank, Rank } from '@/types/rank';

import { useUserStats } from '../useUserStats/useUserStats';

const DISTRIBUTION_PRECISION = 10;

const roundedElo = (elo: number) => Math.floor(elo / DISTRIBUTION_PRECISION) * DISTRIBUTION_PRECISION;

export const useLeaderboardStats = () => {
  const { leaderboards, isLoading: isLoadingLeaderboards } = useCommunityLeaderboards();
  const { leaderboardEntries, isLoading: isLoadingLeaderboard } = useCommunityLeaderboard(leaderboards[1]?.id ?? -1);
  const { stats, isLoading: isLoadingUserStats } = useUserStats();

  const { theme } = useUnistyles();

  const firstPlayerElo = leaderboardEntries[0]?.elo ?? 0;
  const lastPlayerElo = Math.min(0, leaderboardEntries[leaderboardEntries.length - 1]?.elo ?? 0);
  const lastAethereanElo = leaderboardEntries.findLast((entry, index) => entry.elo > 1800 && index < 100)?.elo ?? 1800;

  const distributionPerRank = leaderboardEntries.reduce(
    (acc, entry) => {
      const rank = getRank(entry.elo, entry.position);
      if (acc[rank]?.value) acc[rank].value++;
      else acc[rank] = { value: 1, frontColor: theme.color[rank] };
      return acc;
    },
    {} as Record<Rank, barDataItem>,
  );

  const distributionPerElo = useMemo(() => {
    if (!leaderboardEntries.length || !firstPlayerElo) return [];

    const result = Array.from(
      { length: Math.ceil(firstPlayerElo / DISTRIBUTION_PRECISION) },
      (_, i) => i * DISTRIBUTION_PRECISION,
    ).reduce(
      (acc, elo) => {
        acc[elo] = { value: 0, label: elo.toString() };
        return acc;
      },
      {} as Record<number, lineDataItem>,
    );

    leaderboardEntries.forEach((entry) => {
      const elo = roundedElo(entry.elo);
      if (result[elo].value) result[elo].value++;
      else result[elo].value = 1;
    });

    if (stats?.rankedElo != null) {
      const playerElo = roundedElo(stats.rankedElo);
      if (result[playerElo]) result[playerElo].dataPointColor = 'red';
    }

    return result;
  }, [firstPlayerElo, leaderboardEntries, stats?.rankedElo]);

  return {
    firstPlayerElo,
    lastPlayerElo,
    lastAethereanElo,
    rankDistribution: Object.values(distributionPerRank),
    eloDistribution: Object.values(distributionPerElo),
    isLoading: isLoadingUserStats || isLoadingLeaderboards || isLoadingLeaderboard,
  };
};
