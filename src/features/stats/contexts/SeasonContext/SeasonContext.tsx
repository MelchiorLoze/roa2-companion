import { createContext, type PropsWithChildren, useContext, useState } from 'react';

import { useCommunityLeaderboards } from '../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';
import { MAX_SEASON_INDEX } from '../../types/stats';

type SeasonState = {
  season: { index: number; name: string };
  leaderboardId?: number;
  setSeason: (index: number) => void;
};

const SeasonContext = createContext<SeasonState | undefined>(undefined);

export const SeasonProvider = ({ children }: PropsWithChildren) => {
  const [seasonIndex, setSeasonIndex] = useState(MAX_SEASON_INDEX);
  const { leaderboards } = useCommunityLeaderboards();

  const currentLeaderboard = leaderboards[seasonIndex - 1];
  const seasonName = currentLeaderboard?.displayName.replace(/leaderboard/i, '').trim() || `Season ${seasonIndex}`;

  return (
    <SeasonContext.Provider
      value={{
        season: { index: seasonIndex, name: seasonName },
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
