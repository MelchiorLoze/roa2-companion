import { useEffect } from 'react';

import { type LoadableState } from '@/types/loadableState';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useLoginWithEmail } from '../../data/useLoginWithEmail/useLoginWithEmail';

type AuthState = LoadableState<
  {
    isLoggedIn: boolean;
  },
  {
    login: (credentials: { email: string; password: string }) => void;
    logout: () => void;
  }
>;

export const useAuth = (): AuthState => {
  const { isValid, setSession, clearSession, isLoading: isLoadingSession } = useSession();
  const { session, loginWithEmail, isLoading: isLoadingLogin, isError } = useLoginWithEmail();

  useEffect(() => {
    if (session) setSession(session);
  }, [session, setSession]);

  const baseState = {
    isLoggedIn: undefined,
    login: loginWithEmail,
    logout: clearSession,
    isLoading: false,
    isError: false,
  } as const;

  if (isValid) {
    return {
      ...baseState,
      isLoggedIn: true,
    } as const;
  }

  if (isLoadingSession || isLoadingLogin) {
    return {
      ...baseState,
      isLoading: true,
    } as const;
  }

  if (isError) {
    return {
      ...baseState,
      isError: true,
    } as const;
  }

  return {
    ...baseState,
    isLoggedIn: false,
  } as const;
};
