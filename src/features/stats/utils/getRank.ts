import { MAX_AETHEREAN_PLAYERS, Rank, RANK_ELO_INTERVALS } from '../types/rank';

export const getRank = (elo: number, leaderboardPosition: number) => {
  const rank = Object.keys(RANK_ELO_INTERVALS).find((key) => RANK_ELO_INTERVALS[key as Rank].contains(elo)) as Rank;
  if (rank === Rank.AETHEREAN && leaderboardPosition > MAX_AETHEREAN_PLAYERS) return Rank.GRANDMASTER; // Aetherean rank is only for top 100 players
  return rank;
};
