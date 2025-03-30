import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { useHttpClient } from '@/hooks/core';
import { Session } from '@/types/session';

type GetEntityTokenResponse = {
  EntityToken: string;
  TokenExpiration: string;
};

export const useGetEntityToken = () => {
  const httpClient = useHttpClient();

  const { data, mutate, isPending, isError } = useMutation({
    mutationFn: async () => {
      const data = await httpClient.post<GetEntityTokenResponse>('/Authentication/GetEntityToken');
      return {
        entityToken: data.EntityToken,
        expirationDate: DateTime.fromISO(data.TokenExpiration, { zone: 'utc' }),
      } as Session;
    },
  });

  return {
    newSession: data,
    renew: mutate,
    isLoading: isPending,
    isError,
  };
};
