import { useMutation } from '@tanstack/react-query';

import { TITLE_ID } from '@/constants';
import { useHttpClient } from '@/hooks/core';

export const useSendAccountRecoveryEmail = () => {
  const httpClient = useHttpClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (email: string) =>
      httpClient.post<void>('/Client/SendAccountRecoveryEmail', {
        TitleId: TITLE_ID,
        Email: email,
      }),
  });

  return {
    sendRecoveryEmail: mutate,
    isLoading: isPending,
    isError,
  };
};
