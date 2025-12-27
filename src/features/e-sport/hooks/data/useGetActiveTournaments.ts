import { useQuery } from '@tanstack/react-query';

import { useCompanionApiClient } from '@/hooks/apiClients/useCompanionApiClient/useCompanionApiClient';

import { type TournamentDto } from '../../types/tournament';
import { tournamentFromDto } from '../../utils/tournamentFromDto';

type GetTournamentsResponse = {
  content: TournamentDto[];
};

export const useGetActiveTournaments = () => {
  const apiClient = useCompanionApiClient();

  const { data, isFetching, refetch, isRefetching, isError } = useQuery({
    queryKey: ['tournaments', 'active'],
    queryFn: () => apiClient.get<GetTournamentsResponse>('/api/v1/tournaments/active', { params: { size: '100' } }),
    select: (response) => response.content.map((dto) => tournamentFromDto(dto)),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    tournaments: data ?? [],
    isLoading: isFetching,
    refetch,
    isRefetching,
    isError,
  };
};
