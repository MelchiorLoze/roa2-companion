import { Duration } from 'luxon';
import { useEffect, useRef } from 'react';

import { useAppState } from '@/hooks/core/useAppState/useAppState';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useGetEntityToken } from '../../data/useGetEntityToken/useGetEntityToken';

const RENEWAL_THROTTLE = Duration.fromObject({ minutes: 30 });

const appIsActiveOrBackground = (appState: ReturnType<typeof useAppState>): boolean =>
  appState === 'active' || appState === 'background';

export const useAutomaticSessionRefresh = (): void => {
  const { setSession } = useSession();
  const { renew } = useGetEntityToken({ onSuccess: setSession });
  const appState = useAppState();
  const hasRenewedRef = useRef(false);

  useEffect(() => {
    if (!hasRenewedRef.current && appIsActiveOrBackground(appState)) {
      renew();
      hasRenewedRef.current = true;

      const timeout = RENEWAL_THROTTLE.setTimeout(() => (hasRenewedRef.current = false));

      return () => clearTimeout(timeout);
    }
  }, [appState, renew]);
};
