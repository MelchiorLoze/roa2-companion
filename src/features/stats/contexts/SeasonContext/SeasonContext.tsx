import { createContext, type PropsWithChildren, useContext, useState } from 'react';

import { useCommunityLeaderboards } from '../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';
import { MAX_SEASON_INDEX, MIN_SEASON_INDEX } from '../../types/stats';

type SeasonState = {
  season: {
    index: number;
    name: string;
    isFirst: boolean;
    isLast: boolean;
  };
  leaderboardId?: number;
  isMinSeason?: boolean;
  isMaxSeason?: boolean;
  setPreviousSeason: () => void;
  setNextSeason: () => void;
};

const SeasonContext = createContext<SeasonState | undefined>(undefined);

export const SeasonProvider = ({ children }: PropsWithChildren) => {
  const [seasonIndex, setSeasonIndex] = useState(MAX_SEASON_INDEX);
  const { leaderboards } = useCommunityLeaderboards();

  const currentLeaderboard = leaderboards[seasonIndex - 1];
  const seasonName = currentLeaderboard?.displayName.replace(/leaderboard/i, '').trim() || `Season ${seasonIndex}`;

  const isFirstSeason = seasonIndex === MIN_SEASON_INDEX;
  const isLastSeason = seasonIndex === MAX_SEASON_INDEX;

  const setPreviousSeason = () => {
    if (!isFirstSeason) setSeasonIndex((prev) => prev - 1);
  };
  const setNextSeason = () => {
    if (!isLastSeason) setSeasonIndex((prev) => prev + 1);
  };

  return (
    <SeasonContext.Provider
      value={{
        season: {
          index: seasonIndex,
          name: seasonName,
          isFirst: isFirstSeason,
          isLast: isLastSeason,
        },
        leaderboardId: currentLeaderboard?.id,
        setPreviousSeason,
        setNextSeason,
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
