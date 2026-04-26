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

  const { data, isPending, isRefetching, refetch } = useQuery({
    queryKey: ['userReadOnlyData'],
    queryFn: () => apiClient.post<GetUserReadOnlyDataResponse>('/Client/GetUserReadOnlyData'),
    select: ({
      Data: {
        character_data: { Value: rawCharacterData },
      },
    }): UserData => ({ characterData: JSON.parse(rawCharacterData) }),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    userData: data,
    isLoading: isPending,
    isRefetching,
    refetch,
  } as const;
};
