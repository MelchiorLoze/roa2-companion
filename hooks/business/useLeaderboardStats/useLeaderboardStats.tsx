import { useMemo } from 'react';
import { barDataItem, lineDataItem } from 'react-native-gifted-charts';
import { useUnistyles } from 'react-native-unistyles';

import { useCommunityLeaderboard, useCommunityLeaderboards } from '@/hooks/data';
import { getRank, Rank } from '@/types/rank';

import { useUserStats } from '../useUserStats/useUserStats';

const DISTRIBUTION_PRECISION = 10;

const roundedElo = (elo: number) => Math.floor(elo / DISTRIBUTION_PRECISION) * DISTRIBUTION_PRECISION;

type RankDistributionBarDataItem = barDataItem;
type EloDistributionLineDataItem = lineDataItem & { elo: number };

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
    {} as Record<Rank, RankDistributionBarDataItem>,
  );

  const eloDistribution = useMemo(() => {
    if (!leaderboardEntries.length || !firstPlayerElo) return [];

    const totalEloRange = firstPlayerElo - lastPlayerElo + 1;
    const result = Array.from(
      { length: Math.ceil(totalEloRange / DISTRIBUTION_PRECISION) + 1 },
      (_, i) => i * DISTRIBUTION_PRECISION + roundedElo(lastPlayerElo),
    ).reduce(
      (acc, elo) => ({ ...acc, [elo]: { value: 0, elo: elo } as EloDistributionLineDataItem }),
      {} as Record<number, EloDistributionLineDataItem>,
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

    return Object.values(result).sort((a, b) => a.elo - b.elo);
  }, [firstPlayerElo, lastPlayerElo, leaderboardEntries, stats?.rankedElo]);

  return {
    firstPlayerElo,
    lastPlayerElo,
    lastAethereanElo,
    rankDistribution: Object.values(distributionPerRank),
    eloDistribution,
    isLoading: isLoadingUserStats || isLoadingLeaderboards || isLoadingLeaderboard,
  };
};
