import { DateTime, Duration } from 'luxon';
import React, { createContext, PropsWithChildren, useCallback, useContext } from 'react';

import { useStorageState } from '@/hooks/core';
import { Session } from '@/types/session';

const SESSION_STORAGE_KEY = 'session';
const SESSION_TTL = 24; // hours
const SESSION_RENEW_THRESHOLD = 1;

type SessionState = {
  entityToken?: string;
  isValid: boolean;
  isLoading: boolean;
  shouldRenew: boolean;
  setSession: (session: Session | null) => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

const parseSession = (raw: any): Session => {
  return {
    entityToken: raw.entityToken,
    expirationDate: DateTime.fromISO(raw.expirationDate),
  };
};

const isSessionValid = (session: Session): boolean => session.expirationDate.diffNow().as('millisecond') > 0;
const shouldRenewSession = (session: Session): boolean =>
  session.expirationDate.diffNow().as('millisecond') <
  Duration.fromObject({ hours: SESSION_TTL - SESSION_RENEW_THRESHOLD }).as('millisecond');

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [[session, isLoading], setSession] = useStorageState<Session>(SESSION_STORAGE_KEY, parseSession);
  const isValid = Boolean(session && isSessionValid(session));
  const shouldRenew = Boolean(session && isValid && shouldRenewSession(session));

  const setValidSession = useCallback(
    (session: Session | null) => {
      if (!session || isSessionValid(session)) setSession(session);
    },
    [setSession],
  );

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
