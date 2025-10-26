import { Duration } from 'luxon';
import { useEffect, useRef } from 'react';

import { useAppState } from '@/hooks/core/useAppState/useAppState';

import { useSession } from '../../../contexts/SessionContext/SessionContext';
import { useGetEntityToken } from '../../data/useGetEntityToken/useGetEntityToken';

const RENEWAL_THROTTLE = Duration.fromObject({ minutes: 30 }).as('milliseconds');

export const useAutomaticSessionRefresh = (): void => {
  const { setSession } = useSession();
  const { renew } = useGetEntityToken({ onSuccess: setSession });
  const appState = useAppState();
  const hasRenewedRef = useRef(false);

  useEffect(() => {
    if (!hasRenewedRef.current && /^active|background$/.test(appState)) {
      renew();
      hasRenewedRef.current = true;

      const timeoutId = setTimeout(() => (hasRenewedRef.current = false), RENEWAL_THROTTLE);
      return () => clearTimeout(timeoutId);
    }
  }, [appState, renew]);
};
