import { type LoadableState } from '@/types/loadableState';

import { type LeaderboardEntry } from '../../../types/rank';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const DISTRIBUTION_PRECISION = 20;

const roundElo = (elo: number): number => Math.floor(elo / DISTRIBUTION_PRECISION) * DISTRIBUTION_PRECISION;

const getEloDistribution = (
  leaderboardEntries: LeaderboardEntry[],
  firstPlayerElo: number,
  lastPlayerElo: number,
): Record<number, number> => {
  if (!leaderboardEntries.length) return {};

  const totalEloRange = firstPlayerElo - lastPlayerElo + 1;
  const result = Array.from(
    { length: Math.ceil(totalEloRange / DISTRIBUTION_PRECISION) },
    (_, i) => i * DISTRIBUTION_PRECISION + roundElo(lastPlayerElo),
  ).reduce<Record<number, number>>((acc, elo) => ({ ...acc, [elo]: 0 }), {});

  leaderboardEntries.forEach((entry) => result[roundElo(entry.elo)]++);

  return result;
};

type EloDistributionState = LoadableState<
  {
    eloDistribution: Record<number, number>;
  },
  {
    roundElo: (elo: number) => number;
  }
>;

export const useEloDistribution = (): EloDistributionState => {
  const { firstPlayerElo, lastPlayerElo, leaderboardEntries, isLoading } = useLeaderboardStats();

  const baseState = {
    eloDistribution: undefined,
    roundElo,
    isLoading: false,
    isError: false,
  } as const;

  if (leaderboardEntries) {
    return {
      ...baseState,
      eloDistribution: getEloDistribution(leaderboardEntries, firstPlayerElo, lastPlayerElo),
    } as const;
  }

  if (isLoading) {
    return {
      ...baseState,
      isLoading: true,
    } as const;
  }

  return {
    ...baseState,
    isError: true,
  } as const;
};
