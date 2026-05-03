import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

export const BONUS_DURATION = Duration.fromObject({ minutes: 90 });

const QUEUES = ['casual', '2v2', 'crews'] as const;
type Queue = (typeof QUEUES)[number];

type XpRotationalBonusState = {
  currentQueue: Queue;
  expirationDate: DateTime;
};

const calculateCurrentBonus = (): XpRotationalBonusState => {
  const epochSeconds = DateTime.utc().toSeconds();

  const bonusDurationSeconds = BONUS_DURATION.as('seconds');
  const currentBonusIndex = Math.floor(epochSeconds / bonusDurationSeconds) % QUEUES.length;
  const secondsRemaining = bonusDurationSeconds - (epochSeconds % bonusDurationSeconds);

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
