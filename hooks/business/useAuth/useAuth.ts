import { useEffect } from 'react';

import { useSession } from '@/contexts';
import { useLoginWithEmail } from '@/hooks/data';

export const useAuth = () => {
  const { isValid, setSession, isLoading: isSessionLoading } = useSession();
  const { data, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();

  const logout = () => setSession(null);

  useEffect(() => {
    if (data) {
      setSession(data);
    }
  }, [data, setSession]);

  return {
    isLoggedIn: isValid,
    login: loginWithEmail,
    logout,
    isLoading: isSessionLoading || isLoginLoading,
    isError,
  };
};
