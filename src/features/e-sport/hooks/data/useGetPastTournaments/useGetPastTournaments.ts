import { useQuery } from '@tanstack/react-query';

import { useCompanionApiClient } from '@/hooks/apiClients/useCompanionApiClient/useCompanionApiClient';

import { type TournamentDto } from '../../../types/tournament';
import { tournamentFromDto } from '../../../utils/tournamentFromDto';

type GetPastTournamentsResponse = {
  content: TournamentDto[];
};

export const useGetPastTournaments = () => {
  const apiClient = useCompanionApiClient();

  const { data, isPending, isRefetching, refetch } = useQuery({
    queryKey: ['tournaments', 'past'],
    queryFn: () =>
      apiClient.get<GetPastTournamentsResponse>('/v1/tournaments/past', {
        params: { size: '20', minEntrants: '16' },
      }),
    select: (response) => response.content.map((dto) => tournamentFromDto(dto)),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    tournaments: data,
    isLoading: isPending,
    isRefetching,
    refetch,
  } as const;
};
