import { useState } from 'react';

import { useGetActiveTournaments } from '../../data/useGetActiveTournaments/useGetActiveTournaments';
import { useGetPastTournaments } from '../../data/useGetPastTournaments/useGetPastTournaments';

export const useTournamentsTab = () => {
  const [selectedTab, setSelectedTab] = useState<'active' | 'past'>('active');
  const selectActiveTab = () => setSelectedTab('active');
  const selectPastTab = () => setSelectedTab('past');

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
  const tournaments = selectedTab === 'active' ? activeTournaments : pastTournaments;
  const isLoading = selectedTab === 'active' ? isLoadingActiveTournaments : isLoadingPastTournaments;
  const isRefreshing = selectedTab === 'active' ? isRefetchingActiveTournaments : isRefetchingPastTournaments;
  const isError = selectedTab === 'active' ? isErrorActiveTournaments : isErrorPastTournaments;

  const refresh = () => {
    void refetchActiveTournaments();
    void refetchPastTournaments();
  };

  return {
    tournaments,
    isLoading,
    isRefreshing,
    isError,
    selectedTab,
    selectActiveTab,
    selectPastTab,
    refresh,
  } as const;
};
