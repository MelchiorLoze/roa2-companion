import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import type { LoadableState } from '@/types/loadableState';

import { useCurrentSeasonIndex } from '../../hooks/business/useCurrentSeasonIndex/useCurrentSeasonIndex';
import { useCommunityLeaderboards } from '../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';
import { MIN_SEASON_INDEX, type Season } from '../../types/season';

const isFirstSeason = (index: number): boolean => index === MIN_SEASON_INDEX;
const isLastSeason = (index: number, maxIndex: number): boolean => index === maxIndex;

type SeasonState = LoadableState<
  Readonly<{
    season: Season;
    leaderboardId?: number;
    setPreviousSeason: () => void;
    setNextSeason: () => void;
  }>
>;

const SeasonContext = createContext<SeasonState | undefined>(undefined);

const useSeasonState = (): SeasonState => {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number | undefined>(undefined);
  const { currentSeasonIndex, isLoading: isCurrentSeasonIndexLoading, isError } = useCurrentSeasonIndex();
  const { leaderboards, isLoading: isLeaderboardsLoading } = useCommunityLeaderboards();

  useEffect(() => {
    setSelectedSeasonIndex((prev) => prev ?? currentSeasonIndex);
  }, [currentSeasonIndex]);

  const baseState = {
    season: undefined,
    leaderboardId: undefined,
    setPreviousSeason: undefined,
    setNextSeason: undefined,
    isLoading: false,
    isError: false,
  } as const;

  if (isLeaderboardsLoading || isCurrentSeasonIndexLoading || isError)
    return {
      ...baseState,
      isLoading: true,
    };

  const seasonIndex = selectedSeasonIndex ?? currentSeasonIndex;
  const currentLeaderboard = leaderboards?.[seasonIndex - 1];
  const seasonName = currentLeaderboard?.displayName.replace(/leaderboard/i, '').trim() ?? `Season ${seasonIndex}`;

  const setPreviousSeason = () => {
    setSelectedSeasonIndex((prev) => {
      if (!prev || isFirstSeason(prev)) return prev;
      return prev - 1;
    });
  };
  const setNextSeason = () => {
    setSelectedSeasonIndex((prev) => {
      if (!prev || isLastSeason(prev, currentSeasonIndex)) return prev;
      return prev + 1;
    });
  };

  return {
    ...baseState,
    season: {
      index: seasonIndex,
      name: seasonName,
      isFirst: isFirstSeason(seasonIndex),
      isLast: isLastSeason(seasonIndex, currentSeasonIndex),
    },
    leaderboardId: currentLeaderboard?.id,
    setPreviousSeason,
    setNextSeason,
  };
};

export const SeasonProvider = ({ children }: PropsWithChildren) => {
  const seasonState = useSeasonState();

  return <SeasonContext.Provider value={seasonState}>{children}</SeasonContext.Provider>;
};

export const useSeason = (): SeasonState => {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
};
