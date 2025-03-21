import { useGetPlayerStatistics } from '@/hooks/data/useGetPlayerStatistics/useGetPlayerStatistics';
import { Character } from '@/types/character';
import { CharacterStat, PlayerStats, StatisticName } from '@/types/stats';

const computeStats = (statistics: PlayerStats) => {
  const gamesPlayedPerCharacter: CharacterStat[] = Object.values(Character).map((character) => ({
    character,
    value: statistics[StatisticName[`${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName]],
  }));

  return {
    rankedElo: statistics[StatisticName.RANKED_SEASON_ELO],
    rankedMatchCount: statistics[StatisticName.RANKED_SEASON_MATCHES],
    rankedWinCount: statistics[StatisticName.RANKED_SEASON_WINS],
    rankedWinRate:
      (statistics[StatisticName.RANKED_SEASON_WINS] / statistics[StatisticName.RANKED_SEASON_MATCHES]) * 100,

    globalMatchCount: statistics[StatisticName.TOTAL_SESSIONS_PLAYED],
    globalWinCount: statistics[StatisticName.BETA_WINS],
    globalWinRate: (statistics[StatisticName.BETA_WINS] / statistics[StatisticName.TOTAL_SESSIONS_PLAYED]) * 100,

    gamesPlayedPerCharacter,
  };
};

export const usePlayerStats = () => {
  const { statistics, refetch, isLoading } = useGetPlayerStatistics();

  const stats = statistics && !isLoading ? computeStats(statistics) : undefined;

  return { stats, refresh: refetch, isLoading };
};
