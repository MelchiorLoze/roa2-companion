import React, { createContext, PropsWithChildren, useContext } from 'react';

import { useStorageState } from '@/hooks/core';
import { Session } from '@/types/session';

const SESSION_STORAGE_KEY = 'session';

type SessionState = {
  entityToken?: string;
  isValid: boolean;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

const isSessionValid = (session: Session): boolean => session.expirationDate.diffNow().as('millisecond') > 0;

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[session, isLoading], setSession] = useStorageState(SESSION_STORAGE_KEY);
  const isValid = Boolean(session && isSessionValid(session));

  const setValidSession = (session: Session | null) => {
    if (!session || isSessionValid(session)) setSession(session);
  };

  return (
    <SessionContext.Provider
      value={{
        entityToken: session?.entityToken,
        isValid,
        setSession: setValidSession,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
