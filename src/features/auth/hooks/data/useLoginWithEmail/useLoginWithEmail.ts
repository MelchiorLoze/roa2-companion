import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { TITLE_ID } from '@/constants';
import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

import { type Session } from '../../../types/session';

type Credentials = Readonly<{
  email: string;
  password: string;
}>;

type LoginWithEmailAddressRequest = Readonly<{
  TitleId: string;
  Email: string;
  Password: string;
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
    mutationFn: async ({ email, password }: Credentials): Promise<Session> => {
      const {
        EntityToken: { EntityToken: entityToken, TokenExpiration: tokenExpiration },
      } = await apiClient.post<LoginWithEmailAddressResponse, LoginWithEmailAddressRequest>(
        '/Client/LoginWithEmailAddress',
        {
          body: {
            TitleId: TITLE_ID,
            Email: email,
            Password: password,
          },
        },
      );
      return {
        entityToken,
        expirationDate: DateTime.fromISO(tokenExpiration, { zone: 'utc' }),
      };
    },
  });

  return { session: data, loginWithEmail, isLoading: isPending, isError } as const;
};
