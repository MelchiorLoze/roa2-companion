import { useEffect, useRef } from 'react';

import { useSession } from '@/contexts';
import { useGetEntityToken, useLoginWithEmail } from '@/hooks/data';

export const useAuth = ({ enableAutoRefresh } = { enableAutoRefresh: false }) => {
  const {
    isValid,
    shouldRenew: shouldRenewSession,
    setSession,
    clearSession,
    isLoading: isSessionLoading,
  } = useSession();
  const { session, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();
  const { newSession, renew } = useGetEntityToken();
  const hasRenewedRef = useRef(false);

  useEffect(() => {
    if (session) setSession(session);
  }, [session, setSession]);

  useEffect(() => {
    if (newSession) setSession(newSession);
  }, [newSession, setSession]);

  useEffect(() => {
    if (enableAutoRefresh && shouldRenewSession && !hasRenewedRef.current) {
      renew();
      hasRenewedRef.current = true;
    }
  }, [enableAutoRefresh, shouldRenewSession, renew]);

  return {
    isLoggedIn: isValid,
    login: loginWithEmail,
    logout: clearSession,
    isLoading: isSessionLoading || isLoginLoading,
    isError,
  };
};
