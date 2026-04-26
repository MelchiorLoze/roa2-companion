import { useMutation } from '@tanstack/react-query';

import { TITLE_ID } from '@/constants';
import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

type SendAccountRecoveryEmailRequest = Readonly<{
  TitleId: string;
  Email: string;
}>;

export const useSendAccountRecoveryEmail = () => {
  const apiClient = useGameApiClient();

  const { mutate, isSuccess, isPending, isError } = useMutation({
    mutationFn: (email: string) =>
      apiClient.post<void, SendAccountRecoveryEmailRequest>('/Client/SendAccountRecoveryEmail', {
        body: {
          TitleId: TITLE_ID,
          Email: email,
        },
      }),
  });

  return {
    sendRecoveryEmail: mutate,
    isSuccess,
    isLoading: isPending,
    isError,
  } as const;
};
