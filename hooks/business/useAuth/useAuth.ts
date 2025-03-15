import { useEffect, useRef } from 'react';

import { useSession } from '@/contexts';
import { useGetEntityToken, useLoginWithEmail } from '@/hooks/data';

export const useAuth = ({ enableAutoRefresh } = { enableAutoRefresh: false }) => {
  const { isValid, shouldRenew: shouldRenewSession, setSession, isLoading: isSessionLoading } = useSession();
  const { session, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();
  const { newSession, renew } = useGetEntityToken();
  const hasRenewedRef = useRef(false);

  const logout = () => setSession(null);

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
    logout,
    isLoading: isSessionLoading || isLoginLoading,
    isError,
  };
};
