import { Duration } from 'luxon';
import React, { createContext, PropsWithChildren, useContext } from 'react';

import { useStorageState } from '@/hooks/core';
import { Session } from '@/types/session';

const SESSION_STORAGE_KEY = 'session';

type SessionState = {
  entityToken?: string;
  isValid: boolean;
  isLoading: boolean;
  shouldRenew: boolean;
  setSession: (session: Session | null) => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

const isSessionValid = (session: Session): boolean => session.expirationDate.diffNow().as('millisecond') > 0;
const shouldRenewSession = (session: Session): boolean =>
  session.expirationDate.diffNow().as('millisecond') < Duration.fromObject({ hours: 23 }).as('millisecond');

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[session, isLoading], setSession] = useStorageState(SESSION_STORAGE_KEY);
  const isValid = Boolean(session && isSessionValid(session));
  const shouldRenew = Boolean(session && isValid && shouldRenewSession(session));

  const setValidSession = (session: Session | null) => {
    if (!session || isSessionValid(session)) setSession(session);
  };

  return (
    <SessionContext.Provider
      value={{
        entityToken: session?.entityToken,
        isValid,
        shouldRenew,
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
