import { BASE_URL, TITLE_ID } from '@/constants';
import { useMutation } from '@tanstack/react-query';

type LoginWithEmailAddressRequest = {
  email: string;
  password: string;
};

type LoginWithEmailAddressResponse = {
  EntityToken: string;
  TokenExpiration: string;
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

  return (await response.json()).data.EntityToken as LoginWithEmailAddressResponse;
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
