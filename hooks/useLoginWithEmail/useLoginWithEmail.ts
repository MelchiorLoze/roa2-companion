import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { BASE_URL, TITLE_ID } from '@/constants';
import { Session } from '@/types/session';

type LoginWithEmailAddressRequest = {
  email: string;
  password: string;
};

type LoginWithEmailAddressResponse = {
  data: {
    EntityToken: {
      EntityToken: string;
      TokenExpiration: string;
    };
  };
};

const loginWithEmailAddress = async ({ email, password }: LoginWithEmailAddressRequest) => {
  const response = await fetch(`${BASE_URL}/Client/LoginWithEmailAddress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      TitleId: TITLE_ID,
      Email: email,
      Password: password,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  const responseData = (await response.json()) as LoginWithEmailAddressResponse;
  const result = responseData.data.EntityToken;

  return {
    entityToken: result.EntityToken,
    expirationDate: DateTime.fromISO(result.TokenExpiration),
  } as Session;
};

export const useLoginWithEmail = () => {
  const {
    data,
    mutate: loginWithEmail,
    isError,
    isPending,
  } = useMutation({
    mutationFn: loginWithEmailAddress,
  });

  return { data, loginWithEmail, isLoading: isPending, isError };
};
