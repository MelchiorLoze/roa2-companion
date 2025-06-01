import type { barDataItem, lineDataItem } from 'react-native-gifted-charts';
import { useUnistyles } from 'react-native-unistyles';
import type { UnistylesTheme } from 'react-native-unistyles/lib/typescript/src/types';

import { useCommunityLeaderboard, useCommunityLeaderboards } from '@/hooks/data';
import type { LeaderboardEntry, Rank } from '@/types/rank';
import { getRank, MAX_AETHEREAN_PLAYERS } from '@/types/rank';

const DISTRIBUTION_PRECISION = 10;

const roundedElo = (elo: number) => Math.floor(elo / DISTRIBUTION_PRECISION) * DISTRIBUTION_PRECISION;

type RankDistributionBarDataItem = barDataItem;
const getRankDistribution = (
  leaderboardEntries: LeaderboardEntry[],
  theme: UnistylesTheme,
): RankDistributionBarDataItem[] => {
  const result = leaderboardEntries.reduce(
    (acc, entry) => {
      const rank = getRank(entry.elo, entry.position);
      if (acc[rank]?.value) acc[rank].value++;
      else acc[rank] = { value: 1, frontColor: theme.color[rank] };
      return acc;
    },
    {} as Record<Rank, RankDistributionBarDataItem>,
  );

  return Object.values(result);
};

type EloDistributionLineDataItem = { elo: number } & lineDataItem;
const getEloDistribution = (
  leaderboardEntries: LeaderboardEntry[],
  firstPlayerElo: number,
  lastPlayerElo: number,
  userElo: number,
): EloDistributionLineDataItem[] => {
  const totalEloRange = firstPlayerElo - lastPlayerElo + 1;
  const result = Array.from(
    { length: Math.ceil(totalEloRange / DISTRIBUTION_PRECISION) },
    (_, i) => i * DISTRIBUTION_PRECISION + roundedElo(lastPlayerElo),
  ).reduce(
    (acc, elo) => ({ ...acc, [elo]: { elo: elo, value: 0 } as EloDistributionLineDataItem }),
    {} as Record<number, EloDistributionLineDataItem>,
  );

  leaderboardEntries.forEach((entry) => {
    const elo = roundedElo(entry.elo);
    if (result[elo].value) result[elo].value++;
    else result[elo].value = 1;
  });

  const userEloRounded = roundedElo(userElo);
  if (result[userEloRounded]) result[userEloRounded].dataPointColor = 'red';

  return Object.values(result).sort((a, b) => a.elo - b.elo);
};

export const useLeaderboardStats = (userElo = 0) => {
  const { leaderboards, isLoading: isLoadingLeaderboards } = useCommunityLeaderboards();
  const { leaderboardEntries, isLoading: isLoadingLeaderboard } = useCommunityLeaderboard(
    leaderboards.length ? leaderboards[leaderboards.length - 1].id : undefined,
  );

  const { theme } = useUnistyles();

  const firstPlayerElo = leaderboardEntries[0]?.elo ?? 0;
  const lastPlayerElo = Math.min(0, leaderboardEntries[leaderboardEntries.length - 1]?.elo ?? 0);
  const lastAethereanElo =
    leaderboardEntries.findLast((entry) => entry.elo > 1800 && entry.position < MAX_AETHEREAN_PLAYERS)?.elo ?? 0;

  return {
    firstPlayerElo,
    lastPlayerElo,
    lastAethereanElo,
    rankDistribution: getRankDistribution(leaderboardEntries, theme),
    eloDistribution: getEloDistribution(leaderboardEntries, firstPlayerElo, lastPlayerElo, userElo),
    isLoading: isLoadingLeaderboards || isLoadingLeaderboard,
  };
};
