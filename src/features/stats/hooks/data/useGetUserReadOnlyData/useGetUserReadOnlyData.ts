import { useQuery } from '@tanstack/react-query';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type UserData } from '../../../types/stats';

type GetUserReadOnlyDataResponse = DeepReadonly<{
  Data: {
    character_data: {
      Value: string;
    };
  };
}>;

export const useGetUserReadOnlyData = () => {
  const apiClient = useGameApiClient();

  const { data, refetch, isPending, isRefetching, isError } = useQuery({
    queryKey: ['userReadOnlyData'],
    queryFn: () => apiClient.post<GetUserReadOnlyDataResponse>('/Client/GetUserReadOnlyData'),
    select: (data): UserData => ({ characterData: JSON.parse(data.Data.character_data.Value) }),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    userData: data,
    refetch,
    isLoading: isPending,
    isRefetching,
    isError,
  } as const;
};
