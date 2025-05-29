import { barDataItem, lineDataItem } from 'react-native-gifted-charts';
import { useUnistyles } from 'react-native-unistyles';

import { useCommunityLeaderboard, useCommunityLeaderboards } from '@/hooks/data';
import { Rank } from '@/types/stats';

import { getRank, useUserStats } from '../useUserStats/useUserStats';

export const useLeaderboardStats = () => {
  const { stats, isLoading: isLoadingUserStats } = useUserStats();
  const { leaderboards, isLoading: isLoadingLeaderboards } = useCommunityLeaderboards();
  const { leaderboardEntries, isLoading: isLoadingLeaderboard } = useCommunityLeaderboard(leaderboards[1]?.id ?? -1);

  const { theme } = useUnistyles();

  const firstPlayerElo = leaderboardEntries[0]?.elo ?? 0;
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

  const precision = 10;
  const distributionPerElo = Array.from(
    { length: Math.ceil(firstPlayerElo / precision) },
    (_, i) => i * precision,
  ).reduce(
    (acc, elo) => {
      acc[elo] = { value: 0, label: elo.toString() };
      return acc;
    },
    {} as Record<number, lineDataItem>,
  );
  leaderboardEntries.forEach((entry) => {
    const elo = Math.floor(entry.elo / precision) * precision; // round down to the nearest precision
    if (distributionPerElo[elo].value) distributionPerElo[elo].value++;
    else distributionPerElo[elo].value = 1;
  });

  if (stats?.rankedElo != null) {
    const playerElo = Math.floor(stats.rankedElo / precision) * precision; // round down to the nearest precision
    if (distributionPerElo[playerElo]) distributionPerElo[playerElo].dataPointColor = 'red';
  }

  return {
    firstPlayerElo,
    lastAethereanElo,
    rankDistribution: Object.values(distributionPerRank),
    eloDistribution: Object.values(distributionPerElo),
    isLoading: isLoadingUserStats || isLoadingLeaderboards || isLoadingLeaderboard,
  };
};
