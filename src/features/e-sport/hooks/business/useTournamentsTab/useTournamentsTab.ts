import { useTabs } from '@/hooks/core/useTabs/useTabs';

import { useGetActiveTournaments } from '../../data/useGetActiveTournaments/useGetActiveTournaments';
import { useGetPastTournaments } from '../../data/useGetPastTournaments/useGetPastTournaments';

const TOURNAMENT_TABS = ['active', 'past'] as const;

export const useTournamentsTab = () => {
  const { tabs, selectedTab, getValueForSelectedTab } = useTabs(TOURNAMENT_TABS);

  const {
    tournaments: activeTournaments,
    isLoading: isLoadingActiveTournaments,
    isError: isErrorActiveTournaments,
    refetch: refetchActiveTournaments,
    isRefetching: isRefetchingActiveTournaments,
  } = useGetActiveTournaments();
  const {
    tournaments: pastTournaments,
    refetch: refetchPastTournaments,
    isLoading: isLoadingPastTournaments,
    isError: isErrorPastTournaments,
    isRefetching: isRefetchingPastTournaments,
  } = useGetPastTournaments();

  const resultForSelectedTab = getValueForSelectedTab({
    active: {
      tournaments: activeTournaments,
      isLoading: isLoadingActiveTournaments,
      isError: isErrorActiveTournaments,
      isRefreshing: isRefetchingActiveTournaments,
    },
    past: {
      tournaments: pastTournaments,
      isLoading: isLoadingPastTournaments,
      isError: isErrorPastTournaments,
      isRefreshing: isRefetchingPastTournaments,
    },
  });

  const refresh = () => {
    void refetchActiveTournaments();
    void refetchPastTournaments();
  };

  return {
    ...resultForSelectedTab,
    tabs,
    selectedTab,
    refresh,
  } as const;
};
