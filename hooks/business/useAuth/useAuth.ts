import { useEffect } from 'react';

import { useSession } from '@/contexts';
import { useGetEntityToken, useLoginWithEmail } from '@/hooks/data';

export const useAuth = () => {
  const { isValid, shouldRenew, setSession, isLoading: isSessionLoading } = useSession();
  const { session, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();
  const { newSession, renew } = useGetEntityToken();

  const logout = () => setSession(null);

  useEffect(() => {
    if (session) setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    if (newSession) setSession(newSession);
  }, [newSession, setSession]);

  useEffect(() => {
    if (shouldRenew) renew();
  }, [shouldRenew, renew]);

  return {
    isLoggedIn: isValid,
    login: loginWithEmail,
    logout,
    isLoading: isSessionLoading || isLoginLoading,
    isError,
  };
};
