import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type Session } from '../../../types/session';

type GetEntityTokenResponse = Readonly<{
  EntityToken: string;
  TokenExpiration: string;
}>;

export const useGetEntityToken = () => {
  const apiClient = useGameApiClient();

  const { data, mutate, isPending, isError } = useMutation({
    mutationFn: async (): Promise<Session> => {
      const data = await apiClient.post<GetEntityTokenResponse>('/Authentication/GetEntityToken');
      return {
        entityToken: data.EntityToken,
        expirationDate: DateTime.fromISO(data.TokenExpiration, { zone: 'utc' }),
      };
    },
  });

  return {
    newSession: data,
    renew: mutate,
    isLoading: isPending,
    isError,
  } as const;
};
