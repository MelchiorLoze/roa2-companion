import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { MAX_AETHEREAN_PLAYERS } from '../../../types/rank';
import { useCommunityLeaderboard } from '../../data/useCommunityLeaderboard/useCommunityLeaderboard';

export const useLeaderboardStats = () => {
  const { leaderboardId, isLoading: isLoadingSeason } = useSeason();
  const { leaderboardEntries, isLoading: isLoadingLeaderboard } = useCommunityLeaderboard(leaderboardId);

  const firstPlayerElo = leaderboardEntries[0]?.elo ?? 0;
  const lastPlayerElo = Math.min(0, leaderboardEntries[leaderboardEntries.length - 1]?.elo ?? 0);
  const lastAethereanElo =
    leaderboardEntries.findLast((entry) => entry.elo > 1800 && entry.position < MAX_AETHEREAN_PLAYERS)?.elo ?? 0;

  return {
    firstPlayerElo,
    lastPlayerElo,
    lastAethereanElo,
    leaderboardEntries,
    isLoading: isLoadingSeason || isLoadingLeaderboard,
  };
};
