import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { TITLE_ID } from '@/constants';
import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type Session } from '../../../types/session';

type LoginWithEmailAddressRequest = Readonly<{
  email: string;
  password: string;
}>;

type LoginWithEmailAddressResponse = DeepReadonly<{
  EntityToken: {
    EntityToken: string;
    TokenExpiration: string;
  };
}>;

export const useLoginWithEmail = () => {
  const apiClient = useGameApiClient();
  const {
    data,
    mutate: loginWithEmail,
    isPending,
    isError,
  } = useMutation({
    mutationFn: async ({ email, password }: LoginWithEmailAddressRequest): Promise<Session> => {
      const data = await apiClient.post<LoginWithEmailAddressResponse>('/Client/LoginWithEmailAddress', {
        body: {
          TitleId: TITLE_ID,
          Email: email,
          Password: password,
        },
      });
      const result = data.EntityToken;
      return {
        entityToken: result.EntityToken,
        expirationDate: DateTime.fromISO(result.TokenExpiration, { zone: 'utc' }),
      };
    },
  });

  return { session: data, loginWithEmail, isLoading: isPending, isError } as const;
};
