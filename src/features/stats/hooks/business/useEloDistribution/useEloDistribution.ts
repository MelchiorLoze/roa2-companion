import { type LeaderboardEntry } from '../../../types/rank';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const DISTRIBUTION_PRECISION = 20;

const roundElo = (elo: number) => Math.floor(elo / DISTRIBUTION_PRECISION) * DISTRIBUTION_PRECISION;

const getEloDistribution = (
  leaderboardEntries: LeaderboardEntry[],
  firstPlayerElo: number,
  lastPlayerElo: number,
): Record<number, number> => {
  if (!leaderboardEntries.length) return {} as const;

  const totalEloRange = firstPlayerElo - lastPlayerElo + 1;
  const result = Array.from(
    { length: Math.ceil(totalEloRange / DISTRIBUTION_PRECISION) },
    (_, i) => i * DISTRIBUTION_PRECISION + roundElo(lastPlayerElo),
  ).reduce((acc, elo) => ({ ...acc, [elo]: 0 }), {} as Record<number, number>);

  leaderboardEntries.forEach((entry) => result[roundElo(entry.elo)]++);

  return result;
};

export const useEloDistribution = () => {
  const { firstPlayerElo, lastPlayerElo, leaderboardEntries, isLoading } = useLeaderboardStats();

  return {
    eloDistribution: getEloDistribution(leaderboardEntries, firstPlayerElo, lastPlayerElo),
    roundElo,
    isLoading,
  } as const;
};
