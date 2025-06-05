import { Character } from '@/types/character';
import { getRank } from '@/types/rank';

import {
  type CharacterStat,
  type PlayerPosition,
  StatisticName,
  type UserData,
  type UserStats,
} from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

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
