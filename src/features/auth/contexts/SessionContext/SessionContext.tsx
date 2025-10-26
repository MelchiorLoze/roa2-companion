import { useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import React, { createContext, type PropsWithChildren, useCallback, useContext } from 'react';

import { useStorageState } from '@/hooks/core/useStorageState/useStorageState';

import { type Session } from '../../types/session';

const SESSION_STORAGE_KEY = 'session';

type SessionState = Readonly<{
  entityToken?: string;
  isValid: boolean;
  isLoading: boolean;
  setSession: (session: Session) => void;
  clearSession: () => void;
}>;

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

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const queryClient = useQueryClient();
  const [[session, isLoading], setSession] = useStorageState<Session>(SESSION_STORAGE_KEY, parseSession);

  const isValid = Boolean(session && isSessionValid(session));

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
        setSession: setValidSession,
        clearSession,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionState => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
