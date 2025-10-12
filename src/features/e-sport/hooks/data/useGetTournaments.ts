import { useQuery } from '@tanstack/react-query';

import { useCompanionApiClient } from '@/hooks/apiClients/useCompanionApiClient/useCompanionApiClient';

import type { TournamentDto } from '../../types/tournament';
import { tournamentFromDto } from '../../utils/tournamentFromDto';

type GetTournamentsResponse = {
  content: TournamentDto[];
};

export const useGetTournaments = () => {
  const apiClient = useCompanionApiClient();

  const { data, isFetching, isError } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => apiClient.get<GetTournamentsResponse>('/api/v1/tournaments'),
    select: (response) => response.content.map((dto) => tournamentFromDto(dto)),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    tournaments: data ?? [],
    isLoading: isFetching,
    isError,
  };
};
