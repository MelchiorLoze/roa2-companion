import { createContext, type PropsWithChildren, useContext, useState } from 'react';

import { useCommunityLeaderboards } from '../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';
import { MAX_SEASON_INDEX, MIN_SEASON_INDEX, type Season } from '../../types/season';

const isFirstSeason = (index: number): boolean => index === MIN_SEASON_INDEX;
const isLastSeason = (index: number): boolean => index === MAX_SEASON_INDEX;

type SeasonState = DeepReadonly<{
  season: Season;
  leaderboardId?: number;
  isLoading: boolean;
  setPreviousSeason: () => void;
  setNextSeason: () => void;
}>;

const SeasonContext = createContext<SeasonState | undefined>(undefined);

export const SeasonProvider = ({ children }: PropsWithChildren) => {
  const [seasonIndex, setSeasonIndex] = useState(MAX_SEASON_INDEX);
  const { leaderboards, isLoading } = useCommunityLeaderboards();

  const currentLeaderboard = leaderboards[seasonIndex - 1];
  const seasonName = currentLeaderboard?.displayName.replace(/leaderboard/i, '').trim() || `Season ${seasonIndex}`;

  const setPreviousSeason = () => {
    setSeasonIndex((prev) => {
      if (!isFirstSeason(prev)) return prev - 1;
      return prev;
    });
  };
  const setNextSeason = () => {
    setSeasonIndex((prev) => {
      if (!isLastSeason(prev)) return prev + 1;
      return prev;
    });
  };

  return (
    <SeasonContext.Provider
      value={{
        season: {
          index: seasonIndex,
          name: seasonName,
          isFirst: isFirstSeason(seasonIndex),
          isLast: isLastSeason(seasonIndex),
        },
        leaderboardId: currentLeaderboard?.id,
        isLoading,
        setPreviousSeason,
        setNextSeason,
      }}
    >
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = (): SeasonState => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
};
