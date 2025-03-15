import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { TITLE_ID } from '@/constants';
import { useHttpClient } from '@/hooks/core';
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
  const httpClient = useHttpClient();
  const {
    data,
    mutate: loginWithEmail,
    isError,
    isPending,
  } = useMutation({
    mutationFn: async ({ email, password }: LoginWithEmailAddressRequest) => {
      const data = await httpClient.post<LoginWithEmailAddressResponse>('/Client/LoginWithEmailAddress', {
        TitleId: TITLE_ID,
        Email: email,
        Password: password,
      });
      const result = data.EntityToken;
      return {
        entityToken: result.EntityToken,
        expirationDate: DateTime.fromISO(result.TokenExpiration),
      } as Session;
    },
  });

  return { session: data, loginWithEmail, isLoading: isPending, isError };
};
