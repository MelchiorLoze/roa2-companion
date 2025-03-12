import React, { createContext, PropsWithChildren, useContext, useEffect } from 'react';

import { useStorageState } from '@/hooks/core';
import { useLoginWithEmail } from '@/hooks/data';
import { Session } from '@/types/session';

const SESSION_STORAGE_KEY = 'session';

type AuthState = {
  entityToken?: string;
  isLoggedIn: boolean;
  login: ReturnType<typeof useLoginWithEmail>['loginWithEmail'];
  logout: () => void;
  isLoading: boolean;
  isError: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const isSessionValid = (session: Session): boolean => session.expirationDate.diffNow().as('millisecond') > 0;

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [[session, isLoading], setSession] = useStorageState(SESSION_STORAGE_KEY);
  const isLoggedIn = Boolean(session && isSessionValid(session));

  const { data, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();

  useEffect(() => {
    if (data && isSessionValid(data)) {
      setSession(data);
    }
  }, [data, setSession]);

  return (
    <AuthContext.Provider
      value={{
        entityToken: session?.entityToken,
        isLoggedIn,
        login: loginWithEmail,
        logout: () => setSession(null),
        isLoading: isLoading || isLoginLoading,
        isError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
};
