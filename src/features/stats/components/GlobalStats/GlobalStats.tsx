import { Spinner } from '@/components/Spinner/Spinner';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';
import { StatRows } from '../StatRows/StatRows';
import { StatsTabContentWrapper } from '../StatsTabContentWrapper/StatsTabContentWrapper';
import { CharacterStatsTable } from './CharacterStatsTable';

export const GlobalStats = () => {
  const { stats, isLoading, isError, refresh, isRefreshing } = useUserGlobalStats();

  if (isLoading || isError) return <Spinner />;

  return (
    <StatsTabContentWrapper isRefreshing={isRefreshing} onRefresh={refresh}>
      <StatRows
        rows={[
          { label: 'Global wins', value: stats.gameStats.winCount },
          { label: 'Global losses', value: stats.gameStats.gameCount - stats.gameStats.winCount },
          { label: 'Global win rate', value: stats.gameStats.winRate.toFixed(2) + '%' },
        ]}
      />

      <CharacterStatsTable characterStats={stats.characterStats} />
    </StatsTabContentWrapper>
  );
};
