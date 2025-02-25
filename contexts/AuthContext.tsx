import { useLoginWithEmail } from '@/hooks/useLoginWithEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

type Session = {
  entityToken: string;
  expiration: Date;
};

type Auth = {
  token?: string;
  isLoggedIn: boolean;
  login: ReturnType<typeof useLoginWithEmail>['loginWithEmail'];
};

const AuthContext = createContext<Auth>({
  token: undefined,
  isLoggedIn: false,
  login: () => undefined,
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<Session>();
  const isLoggedIn = Boolean(session?.expiration && session.expiration.getTime() > Date.now());

  const { data, loginWithEmail, isLoading, isError } = useLoginWithEmail();

  useEffect(() => {
    (async () => {
      const rawStoredSession = await AsyncStorage.getItem('session');
      if (rawStoredSession) {
        const storedSession = JSON.parse(rawStoredSession);
        setSession({
          entityToken: storedSession.EntityToken,
          expiration: new Date(storedSession.TokenExpiration),
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (data) {
      setSession({
        entityToken: data.EntityToken,
        expiration: new Date(data.TokenExpiration),
      });
      AsyncStorage.setItem('session', JSON.stringify(data));
    }
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        token: session?.entityToken,
        isLoggedIn,
        login: loginWithEmail,
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
