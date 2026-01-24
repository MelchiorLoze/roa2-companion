import { useTabs } from '@/hooks/core/useTabs/useTabs';
import type { RefreshableState } from '@/types/loadableState';

import type { Tournament } from '../../../types/tournament';
import { useGetActiveTournaments } from '../../data/useGetActiveTournaments/useGetActiveTournaments';
import { useGetPastTournaments } from '../../data/useGetPastTournaments/useGetPastTournaments';

const TOURNAMENT_TABS = ['active', 'past'] as const;
type TournamentTab = (typeof TOURNAMENT_TABS)[number];

type TournamentsTabState = RefreshableState<
  {
    tournaments: Tournament[];
  },
  Pick<ReturnType<typeof useTabs<TournamentTab>>, 'tabs' | 'selectedTab'>
>;

export const useTournamentsTab = (): TournamentsTabState => {
  const { tabs, selectedTab, getValueForSelectedTab } = useTabs(TOURNAMENT_TABS);

  const {
    tournaments: activeTournaments,
    isLoading: isLoadingActiveTournaments,
    isRefetching: isRefetchingActiveTournaments,
    refetch: refetchActiveTournaments,
  } = useGetActiveTournaments();
  const {
    tournaments: pastTournaments,
    isLoading: isLoadingPastTournaments,
    isRefetching: isRefetchingPastTournaments,
    refetch: refetchPastTournaments,
  } = useGetPastTournaments();

  const baseState = {
    tournaments: undefined,
    tabs,
    selectedTab,
    isLoading: false,
    isError: false,
    isRefreshing: isRefetchingActiveTournaments || isRefetchingPastTournaments,
    refresh: () => {
      void refetchActiveTournaments();
      void refetchPastTournaments();
    },
  } as const;

  const { tournaments, isLoading } = getValueForSelectedTab({
    active: {
      tournaments: activeTournaments,
      isLoading: isLoadingActiveTournaments,
    },
    past: {
      tournaments: pastTournaments,
      isLoading: isLoadingPastTournaments,
    },
  });

  if (tournaments?.length) {
    return {
      ...baseState,
      tournaments,
    } as const;
  }

  if (isLoading) {
    return {
      ...baseState,
      isLoading: true,
    } as const;
  }

  return {
    ...baseState,
    isError: true,
  } as const;
};
