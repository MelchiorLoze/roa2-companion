import { Session } from '@/types/session';
import { useMutation } from '@tanstack/react-query';

import { BASE_URL, TITLE_ID } from '@/constants';

type LoginWithEmailAddressRequest = {
  email: string;
  password: string;
};

export type LoginWithEmailAddressResponse = {
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

  const dto = (await response.json()) as LoginWithEmailAddressResponse;

  return {
    entityToken: dto.data.EntityToken.EntityToken,
    expirationDate: new Date(dto.data.EntityToken.TokenExpiration),
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
