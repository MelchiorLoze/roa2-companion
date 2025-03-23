import { useQuery } from '@tanstack/react-query';

import { useHttpClient } from '@/hooks/core';
import { UserData } from '@/types/stats';

type GetUserReadOnlyDataResponse = {
  Data: {
    character_data: {
      Value: string;
    };
  };
};

export const useGetUserReadOnlyData = () => {
  const httpClient = useHttpClient();

  const { data, refetch, isFetching, isPending, isError } = useQuery({
    queryKey: ['userReadOnlyData'],
    queryFn: () => httpClient.post<GetUserReadOnlyDataResponse>('/Client/GetUserReadOnlyData'),
    select: (data) => ({ characterData: JSON.parse(data.Data.character_data.Value) } as UserData),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    userData: data,
    refetch,
    isLoading: isFetching || isPending,
    isError,
  };
};
