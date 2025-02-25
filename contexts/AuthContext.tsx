import { useLoginWithEmail } from '@/hooks/useLoginWithEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

type Session = {
  entityToken: string;
  expirationDate: Date;
};

type AuthState = {
  entityToken?: string;
  isLoggedIn: boolean;
  login: ReturnType<typeof useLoginWithEmail>['loginWithEmail'];
  isLoading: boolean;
  isError: boolean;
};

const AuthContext = createContext<AuthState>({
  entityToken: undefined,
  isLoggedIn: false,
  login: () => undefined,
  isLoading: false,
  isError: false,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session>();
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = Boolean(session?.expirationDate && session.expirationDate.getTime() > Date.now());

  const { data, loginWithEmail, isLoading: isLoginLoading, isError } = useLoginWithEmail();

  useEffect(() => {
    (async () => {
      const rawStoredSession = await AsyncStorage.getItem('session');
      if (rawStoredSession) {
        const storedSession = JSON.parse(rawStoredSession);
        setSession({
          entityToken: storedSession.EntityToken,
          expirationDate: new Date(storedSession.TokenExpiration),
        });
      } else {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (data) {
      setSession({
        entityToken: data.EntityToken,
        expirationDate: new Date(data.TokenExpiration),
      });
      AsyncStorage.setItem('session', JSON.stringify(data));
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
