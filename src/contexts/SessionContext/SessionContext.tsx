import { useQueryClient } from '@tanstack/react-query';
import { DateTime, Duration } from 'luxon';
import type { PropsWithChildren } from 'react';
import React, { createContext, useCallback, useContext } from 'react';

import { useStorageState } from '@/hooks/core';
import type { Session } from '@/types/session';

const SESSION_STORAGE_KEY = 'session';
const SESSION_TTL = 24; // hours
const SESSION_RENEW_THRESHOLD = 1;

type SessionState = {
  entityToken?: string;
  isValid: boolean;
  isLoading: boolean;
  shouldRenew: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionState | undefined>(undefined);

const parseSession = (raw: unknown): Session => {
  if (!raw || typeof raw !== 'object' || !('entityToken' in raw) || !('expirationDate' in raw))
    throw new Error('Invalid session data');

  const rawSession = raw as { entityToken: string; expirationDate: string };
  return {
    entityToken: rawSession.entityToken,
    expirationDate: DateTime.fromISO(rawSession.expirationDate, { zone: 'utc' }),
  };
};

const isSessionValid = (session: Session): boolean => session.expirationDate.diffNow().as('millisecond') > 0;
const shouldRenewSession = (session: Session): boolean =>
  session.expirationDate.diffNow().as('millisecond') <
  Duration.fromObject({ hours: SESSION_TTL - SESSION_RENEW_THRESHOLD }).as('millisecond');

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [[session, isLoading], setSession] = useStorageState<Session>(SESSION_STORAGE_KEY, parseSession);

  const isValid = Boolean(session && isSessionValid(session));
  const shouldRenew = Boolean(session && isValid && shouldRenewSession(session));

  const setValidSession = useCallback(
    (session: Session) => {
      if (isSessionValid(session)) setSession(session);
    },
    [setSession],
  );

  const clearSession = useCallback(() => {
    setSession(null);
    queryClient.clear();
  }, [queryClient, setSession]);

  return (
    <SessionContext.Provider
      value={{
        entityToken: session?.entityToken,
        isValid,
        shouldRenew,
        setSession: setValidSession,
        clearSession,
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
