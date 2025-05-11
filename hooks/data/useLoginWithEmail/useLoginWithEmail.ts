import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { TITLE_ID } from '@/constants';
import { useGameApiClient } from '@/hooks/apiClients';
import { Session } from '@/types/session';

type LoginWithEmailAddressRequest = {
  email: string;
  password: string;
};

type LoginWithEmailAddressResponse = {
  EntityToken: {
    EntityToken: string;
    TokenExpiration: string;
  };
};

export const useLoginWithEmail = () => {
  const apiClient = useGameApiClient();
  const {
    data,
    mutate: loginWithEmail,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async ({ email, password }: LoginWithEmailAddressRequest) => {
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
      } as Session;
    },
  });

  return { session: data, loginWithEmail, isLoading: isPending, isError };
};
