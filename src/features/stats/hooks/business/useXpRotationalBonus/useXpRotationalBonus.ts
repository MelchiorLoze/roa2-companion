import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

const BONUS_DURATION = Duration.fromObject({ minutes: 90 }).as('seconds');

const QUEUES = ['casual', '2v2', 'crews'] as const;
type Queue = (typeof QUEUES)[number];

type XpRotationalBonusState = {
  currentQueue: Queue;
  expirationDate: DateTime;
};

const calculateCurrentBonus = (): XpRotationalBonusState => {
  const epochSeconds = DateTime.utc().toSeconds();

  const currentBonusIndex = Math.floor(epochSeconds / BONUS_DURATION) % QUEUES.length;
  const secondsRemaining = BONUS_DURATION - (epochSeconds % BONUS_DURATION);

  return {
    currentQueue: QUEUES[currentBonusIndex],
    expirationDate: DateTime.fromSeconds(epochSeconds + secondsRemaining),
  } as const;
};

export const useXpRotationalBonus = (): XpRotationalBonusState => {
  const [state, setState] = useState<XpRotationalBonusState>(calculateCurrentBonus);

  useEffect(() => {
    const timeout = setTimeout(
      () => setState(calculateCurrentBonus),
      state.expirationDate.diffNow().as('milliseconds'),
    );

    return () => clearTimeout(timeout);
  }, [state.expirationDate]);

  return state;
};
