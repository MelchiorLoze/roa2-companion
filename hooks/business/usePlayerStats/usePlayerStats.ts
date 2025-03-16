import { useGetPlayerStatistics } from '@/hooks/data/useGetPlayerStatistics/useGetPlayerStatistics';
import { PlayerStats, StatisticName } from '@/types/stats';

const computeStats = (statistics: PlayerStats) => ({
  rankedElo: statistics[StatisticName.RANKED_SEASON_ELO],
  rankedMatchCount: statistics[StatisticName.RANKED_SEASON_MATCHES],
  rankedWinCount: statistics[StatisticName.RANKED_SEASON_WINS],
  rankedWinRate: (statistics[StatisticName.RANKED_SEASON_WINS] / statistics[StatisticName.RANKED_SEASON_MATCHES]) * 100,

  globalMatchCount: statistics[StatisticName.TOTAL_SESSIONS_PLAYED],
  globalWinCount: statistics[StatisticName.BETA_WINS],
  globalWinRate: (statistics[StatisticName.BETA_WINS] / statistics[StatisticName.TOTAL_SESSIONS_PLAYED]) * 100,

  claMatchCount: statistics[StatisticName.CLA_MATCH_COUNT],
  etaMatchCount: statistics[StatisticName.ETA_MATCH_COUNT],
  fleMatchCount: statistics[StatisticName.FLE_MATCH_COUNT],
  forMatchCount: statistics[StatisticName.FOR_MATCH_COUNT],
  kraMatchCount: statistics[StatisticName.KRA_MATCH_COUNT],
  loxMatchCount: statistics[StatisticName.LOX_MATCH_COUNT],
  mayMatchCount: statistics[StatisticName.MAY_MATCH_COUNT],
  //olyMatchCount: statistics[StatisticName.OLY_MATCH_COUNT],
  orcMatchCount: statistics[StatisticName.ORC_MATCH_COUNT],
  ranMatchCount: statistics[StatisticName.RAN_MATCH_COUNT],
  wraMatchCount: statistics[StatisticName.WRA_MATCH_COUNT],
  zetMatchCount: statistics[StatisticName.ZET_MATCH_COUNT],
});

export const usePlayerStats = () => {
  const { statistics, refetch, isLoading } = useGetPlayerStatistics();

  const stats = statistics && !isLoading ? computeStats(statistics) : undefined;

  return { stats, refresh: refetch, isLoading };
};
