import { type LeaderboardEntry, Rank, RANK_ELO_THRESHOLDS } from '../../../types/rank';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

const findFirstIndexWithElo = (leaderboardEntries: LeaderboardEntry[], targetElo: number): number => {
  let left = 0;
  let right = leaderboardEntries.length;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (leaderboardEntries[mid].elo > targetElo) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
};

const getRankDistribution = (leaderboardEntries: LeaderboardEntry[]): Record<Rank, number> => {
  if (!leaderboardEntries.length)
    return Object.fromEntries(Object.values(Rank).map((rank) => [rank, 0])) as Record<Rank, number>;

  const boundaries = Object.values(RANK_ELO_THRESHOLDS).reverse();
  const indices = boundaries.map((elo) => findFirstIndexWithElo(leaderboardEntries, elo));

  return {
    [Rank.STONE]: leaderboardEntries.length - indices[7],
    [Rank.BRONZE]: indices[7] - indices[6],
    [Rank.SILVER]: indices[6] - indices[5],
    [Rank.GOLD]: indices[5] - indices[4],
    [Rank.PLATINUM]: indices[4] - indices[3],
    [Rank.DIAMOND]: indices[3] - indices[2],
    [Rank.MASTER]: indices[2] - indices[1],
    [Rank.GRANDMASTER]: indices[1] - indices[0] + Math.max(0, indices[0] - 100), // 1700-1799 + excess above 1800
    [Rank.AETHEREAN]: Math.min(100, indices[0]), // Top 100 players above 1800
  };
};

export const useRankDistribution = () => {
  const { leaderboardEntries, isLoading } = useLeaderboardStats();

  return {
    rankDistribution: getRankDistribution(leaderboardEntries),
    isLoading,
  };
};
