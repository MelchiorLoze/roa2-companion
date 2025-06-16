import { type LeaderboardEntry, Rank } from '../../../types/rank';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';

function findFirstIndexWithElo(leaderboardEntries: LeaderboardEntry[], targetElo: number): number {
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
}

function getRankDistribution(leaderboardEntries: LeaderboardEntry[]): Record<Rank, number> {
  if (!leaderboardEntries.length)
    return {
      [Rank.STONE]: 0,
      [Rank.BRONZE]: 0,
      [Rank.SILVER]: 0,
      [Rank.GOLD]: 0,
      [Rank.PLATINUM]: 0,
      [Rank.DIAMOND]: 0,
      [Rank.MASTER]: 0,
      [Rank.GRANDMASTER]: 0,
      [Rank.AETHEREAN]: 0,
    };

  const boundaries = [1800, 1700, 1500, 1300, 1100, 900, 700, 500];
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
}

export const useRankDistribution = () => {
  const { leaderboardEntries, isLoading } = useLeaderboardStats();

  return {
    rankDistribution: getRankDistribution(leaderboardEntries),
    isLoading,
  };
};
