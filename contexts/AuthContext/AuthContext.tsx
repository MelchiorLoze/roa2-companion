import { Session } from '@/types/session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { useLoginWithEmail } from '@/hooks/useLoginWithEmail/useLoginWithEmail';

const SESSION_STORAGE_KEY = 'session';

type AuthState = {
  entityToken?: string;
  isLoggedIn: boolean;
  login: ReturnType<typeof useLoginWithEmail>['loginWithEmail'];
  isLoading: boolean;
  isError: boolean;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const isSessionValid = (session: Session) => session.expirationDate.getTime() > Date.now();

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session>();
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = Boolean(session && isSessionValid(session));

  const { data, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();

  useEffect(() => {
    (async () => {
      const rawStoredSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (rawStoredSession) {
        const storedSession = JSON.parse(rawStoredSession);
        setSession({ entityToken: storedSession.entityToken, expirationDate: new Date(storedSession.expirationDate) });
      } else {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (data && isSessionValid(data)) {
      setSession(data);
      AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  useEffect(() => {
    if (session) setIsLoading(false);
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        entityToken: session?.entityToken,
        isLoggedIn,
        login: loginWithEmail,
        isLoading: isLoading || isLoginLoading,
        isError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
