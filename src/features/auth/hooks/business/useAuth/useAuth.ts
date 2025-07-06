import { useEffect } from 'react';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useLoginWithEmail } from '../../data/useLoginWithEmail/useLoginWithEmail';

export const useAuth = () => {
  const { isValid, setSession, clearSession, isLoading: isLoadingSession } = useSession();
  const { session, loginWithEmail, isLoading: isLoadingLogin, isError } = useLoginWithEmail();

  useEffect(() => {
    if (session) setSession(session);
  }, [session, setSession]);

  return {
    isLoggedIn: isValid,
    login: loginWithEmail,
    logout: clearSession,
    isLoading: isLoadingSession || isLoadingLogin,
    isError,
  } as const;
};
