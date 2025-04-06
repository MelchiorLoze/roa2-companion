import { useGetLeaderboardAroundPlayer, useGetPlayerStatistics, useGetUserReadOnlyData } from '@/hooks/data';
import { Character } from '@/types/character';
import { CharacterStat, PlayerPosition, Rank, StatisticName, UserData, UserStats } from '@/types/stats';

const getRank = (elo: number, position: number) => {
  if (elo < 500) return Rank.STONE;
  if (elo < 700) return Rank.BRONZE;
  if (elo < 900) return Rank.SILVER;
  if (elo < 1100) return Rank.GOLD;
  if (elo < 1300) return Rank.PLATINUM;
  if (elo < 1500) return Rank.DIAMOND;
  if (elo < 1700) return Rank.MASTER;
  if (elo < 1800 || position > 100) return Rank.GRANDMASTER;
  return Rank.AETHEREAN;
};

const computeStats = (statistics: UserStats, userPosition: PlayerPosition, userReadOnlyData: UserData) => {
  const rankedPosition = userPosition.position;
  const rankedElo = statistics[StatisticName.RANKED_S2_ELO];
  const rankedSetCount = statistics[StatisticName.RANKED_S2_SETS];
  const rankedWinCount = statistics[StatisticName.RANKED_S2_WINS];
  const rankedWinRate = rankedSetCount ? (rankedWinCount / rankedSetCount) * 100 : 0;

  const globalGameCount = statistics[StatisticName.TOTAL_SESSIONS_PLAYED];
  const globalWinCount = statistics[StatisticName.BETA_WINS];
  const globalWinRate = globalGameCount ? (globalWinCount / globalGameCount) * 100 : 0;

  const characterStats: CharacterStat[] = Object.values(Character).map((character) => ({
    character,
    gameCount: statistics[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
    level: userReadOnlyData.characterData[character].lvl,
  }));

  return {
    rankedPosition,
    rank: getRank(rankedElo, rankedPosition),
    rankedElo,
    rankedSetCount,
    rankedWinCount,
    rankedWinRate,

    globalMatchCount: globalGameCount,
    globalWinCount,
    globalWinRate,

    characterStats,
  };
};

export const useUserStats = () => {
  const { statistics, refetch: refetchStatistics, isLoading: isStatisticsLoading } = useGetPlayerStatistics();
  const {
    playerPositions: [userRankedPosition],
    refetch: refetchPlayerPositions,
    isLoading: isPlayerPositionLoading,
  } = useGetLeaderboardAroundPlayer({ maxResultCount: 1, statisticName: StatisticName.RANKED_S2_ELO });
  const { userData, refetch: refetchUserData, isLoading: isUserDataLoading } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchStatistics();
    void refetchPlayerPositions();
    void refetchUserData();
  };

  const isLoading = isStatisticsLoading || isPlayerPositionLoading || isUserDataLoading;

  const stats =
    statistics && userRankedPosition && userData && !isLoading
      ? computeStats(statistics, userRankedPosition, userData)
      : undefined;

  return { stats, refresh, isLoading };
};
