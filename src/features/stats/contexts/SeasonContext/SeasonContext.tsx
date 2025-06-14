import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { useCurrentSeasonIndex } from '../../hooks/business/useCurrentSeasonIndex/useCurrentSeasonIndex';
import { useCommunityLeaderboards } from '../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';

type SeasonState = {
  seasonIndex: number;
  seasonName: string;
  leaderboardId?: number;
  setSeason: (index: number) => void;
};

const SeasonContext = createContext<SeasonState | undefined>(undefined);

export const SeasonProvider = ({ children }: PropsWithChildren) => {
  const [seasonIndex, setSeasonIndex] = useState(1);
  const { leaderboards } = useCommunityLeaderboards();
  const { currentSeasonIndex } = useCurrentSeasonIndex();

  const currentLeaderboard = leaderboards[seasonIndex - 1];
  const seasonName = currentLeaderboard?.displayName.replace(' Leaderboard', '') || `Season ${seasonIndex}`;

  useEffect(() => {
    if (currentSeasonIndex) setSeasonIndex(currentSeasonIndex);
  }, [currentSeasonIndex]);

  return (
    <SeasonContext.Provider
      value={{
        seasonIndex,
        seasonName,
        leaderboardId: currentLeaderboard?.id,
        setSeason: setSeasonIndex,
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
};
