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
    setCount: rawStats[StatisticName.RANKED_SETS] ?? 0,
    winCount: rawStats[StatisticName.RANKED_WINS] ?? 0,
    winRate: 0,
  };

  if (seasonIndex === MIN_SEASON_INDEX) {
    result.setCount = rawStats[StatisticName.RANKED_S1_SETS] ?? 0;
    result.winCount = rawStats[StatisticName.RANKED_S1_WINS] ?? 0;
  }

  result.winRate = result.setCount ? (result.winCount / result.setCount) * 100 : 0;

  return result;
};

const getRankedStats = (rawStats: PlayerStatistics, userPosition: PlayerPosition, seasonIndex: number) => {
  const position = userPosition.position;

  const setStats = getSetStatsForSeason(rawStats, seasonIndex);
  const elo = setStats && setStats.winCount < 4 ? undefined : rawStats[getEloStatNameForSeason(seasonIndex)];

  return {
    position,
    rank: elo ? getRank(elo, position) : undefined,
    elo,
    setStats,
  } as const;
};

const getGlobalStats = (rawStats: PlayerStatistics) => {
  const gameCount = rawStats[StatisticName.TOTAL_SESSIONS_PLAYED] ?? 0;
  const winCount = rawStats[StatisticName.BETA_WINS] ?? 0;
  const winRate = gameCount ? (winCount / gameCount) * 100 : 0;

  return { gameStats: { gameCount, winCount, winRate } } as const;
};

const getCharacterStats = (rawStats: PlayerStatistics, userData: UserData) =>
  Object.values(Character).map((character) => ({
    character,
    gameCount: rawStats[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]] ?? 0,
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

  return { rankedStats, globalStats, characterStats, refresh, isLoading } as const;
};
