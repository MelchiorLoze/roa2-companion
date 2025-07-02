import { Character } from '@/types/character';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import {
  MAX_SEASON_INDEX,
  MIN_SEASON_INDEX,
  type PlayerPosition,
  type PlayerStatistics,
  StatisticName,
  type UserData,
} from '../../../types/stats';
import { getRank } from '../../../utils/getRank';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';

const getEloStatNameForSeason = (seasonIndex: number) =>
  StatisticName[`RANKED_S${seasonIndex}_ELO` as keyof typeof StatisticName];

const getSetStatsForSeason = (rawStats: PlayerStatistics, seasonIndex: number) => {
  if (seasonIndex !== MIN_SEASON_INDEX && seasonIndex !== MAX_SEASON_INDEX) return undefined;

  const result = {
    setCount: rawStats[StatisticName.RANKED_SETS],
    winCount: rawStats[StatisticName.RANKED_WINS],
    winRate: 0,
  };

  if (seasonIndex === MIN_SEASON_INDEX) {
    result.setCount = rawStats[StatisticName.RANKED_S1_SETS];
    result.winCount = rawStats[StatisticName.RANKED_S1_WINS];
  }

  result.winRate = result.setCount ? (result.winCount / result.setCount) * 100 : 0;

  return result;
};

const getRankedStats = (rawStats: PlayerStatistics, userPosition: PlayerPosition, seasonIndex: number) => {
  const position = userPosition.position;
  const elo = rawStats[getEloStatNameForSeason(seasonIndex)];

  const setStats = getSetStatsForSeason(rawStats, seasonIndex);

  return {
    position,
    rank: getRank(elo, position),
    elo,
    setStats,
  };
};

const getGlobalStats = (rawStats: PlayerStatistics) => {
  const gameCount = rawStats[StatisticName.TOTAL_SESSIONS_PLAYED];
  const winCount = rawStats[StatisticName.BETA_WINS];
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameStats: { gameCount, winCount, winRate } };
};

const getCharacterStats = (rawStats: PlayerStatistics, userData: UserData) =>
  Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
    level: userData.characterData[character]?.lvl ?? 0,
  }));

export const useUserStats = () => {
  const { season } = useSeason();
  const {
    statistics: rawStats,
    refetch: refetchPlayerStatistics,
    isLoading: isLoadingRawStats,
  } = useGetPlayerStatistics();
  const {
    playerPositions: [userRankedPosition],
    refetch: refetchPlayerPosition,
    isLoading: isLoadingPlayerPosition,
  } = useGetLeaderboardAroundPlayer({
    maxResultCount: 1,
    statisticName: getEloStatNameForSeason(season.index),
  });
  const { userData, refetch: refetchUserData, isLoading: isLoadingUserData } = useGetUserReadOnlyData();

  const refresh = () => {
    void refetchPlayerStatistics();
    void refetchPlayerPosition();
    void refetchUserData();
  };

  const isLoading = isLoadingRawStats || isLoadingPlayerPosition || isLoadingUserData;

  const rankedStats =
    rawStats && userRankedPosition && !isLoading
      ? getRankedStats(rawStats, userRankedPosition, season.index)
      : undefined;
  const globalStats = rawStats && !isLoading ? getGlobalStats(rawStats) : undefined;
  const characterStats = rawStats && userData && !isLoading ? getCharacterStats(rawStats, userData) : undefined;

  return { rankedStats, globalStats, characterStats, refresh, isLoading };
};
