import { useMutation } from '@tanstack/react-query';

import { TITLE_ID } from '@/constants';
import { useGameApiClient } from '@/hooks/apiClients/useGameApiClient/useGameApiClient';

export const useSendAccountRecoveryEmail = () => {
  const apiClient = useGameApiClient();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (email: string) =>
      apiClient.post<void>('/Client/SendAccountRecoveryEmail', {
        body: {
          TitleId: TITLE_ID,
          Email: email,
        },
      }),
  });

  return {
    sendRecoveryEmail: mutate,
    isLoading: isPending,
    isSuccess,
    isError,
  } as const;
};
