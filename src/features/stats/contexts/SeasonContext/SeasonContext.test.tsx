import { act, renderHook } from '@testing-library/react-native';
import { type PropsWithChildren } from 'react';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useCurrentSeasonIndex } from '../../hooks/business/useCurrentSeasonIndex/useCurrentSeasonIndex';
import { useCommunityLeaderboards } from '../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards';
import { type Leaderboard } from '../../types/rank';
import { MIN_SEASON_INDEX } from '../../types/season';
import { SeasonProvider, useSeason } from './SeasonContext';

jest.mock('../../hooks/business/useCurrentSeasonIndex/useCurrentSeasonIndex');
const useCurrentSeasonIndexMock = jest.mocked(useCurrentSeasonIndex);

jest.mock('../../hooks/data/useCommunityLeaderboards/useCommunityLeaderboards');
const useCommunityLeaderboardsMock = jest.mocked(useCommunityLeaderboards);

const mockLeaderboards: Leaderboard[] = [
  { id: 111, displayName: 'Ranked Lite Leaderboard', name: 'Season 1', entryCount: 100 },
  { id: 222, displayName: 'Leaderboard Spring 2025', name: 'Season 2', entryCount: 200 },
  { id: 333, displayName: 'Summer 2025', name: 'Season 3', entryCount: 300 },
  { id: 444, displayName: 'Fall 2025', name: 'Season 4', entryCount: 400 },
];

const mockCommunityLeaderboards = (leaderboards = mockLeaderboards) => {
  useCommunityLeaderboardsMock.mockReturnValue({
    leaderboards,
    isLoading: false,
  });
};

const MAX_SEASON_INDEX = mockLeaderboards.length;

const Wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryClientProvider>
    <SeasonProvider>{children}</SeasonProvider>
  </TestQueryClientProvider>
);

const renderUseSeason = () => {
  const { result } = renderHook(useSeason, { wrapper: Wrapper });

  expect(useCurrentSeasonIndexMock).toHaveBeenCalled();
  expect(useCommunityLeaderboardsMock).toHaveBeenCalled();

  return { result };
};

describe('useSeason', () => {
  beforeEach(() => {
    useCurrentSeasonIndexMock.mockReturnValue({
      currentSeasonIndex: MAX_SEASON_INDEX,
      isLoading: false,
      isError: false,
    });
    mockCommunityLeaderboards();
  });

  it('throws an error when not used inside a SeasonProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();
    expect(() => renderHook(useSeason)).toThrow('useSeason must be used within a SeasonProvider');
    console.error = originalError;
  });

  it('returns loading state when current season index is loading', () => {
    useCurrentSeasonIndexMock.mockReturnValue({
      currentSeasonIndex: undefined,
      isLoading: true,
      isError: false,
    });

    const { result } = renderUseSeason();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.season).toBeUndefined();
  });

  it('returns loading state when leaderboards are loading', () => {
    useCommunityLeaderboardsMock.mockReturnValue({
      leaderboards: undefined,
      isLoading: true,
    });

    const { result } = renderUseSeason();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.season).toBeUndefined();
  });

  it('returns loading state when current season index has an error', () => {
    useCurrentSeasonIndexMock.mockReturnValue({
      currentSeasonIndex: undefined,
      isLoading: false,
      isError: true,
    });

    const { result } = renderUseSeason();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.season).toBeUndefined();
  });

  it('initializes with max season index', () => {
    const { result } = renderUseSeason();

    expect(result.current.season!.index).toBe(MAX_SEASON_INDEX);
    expect(result.current.season!.isLast).toBe(true);
    expect(result.current.season!.isFirst).toBe(false);
  });

  it('displays correct season name from leaderboard', () => {
    const { result } = renderUseSeason();

    expect(result.current.season!.name).toBe('Fall 2025');
    expect(result.current.leaderboardId).toBe(444);
  });

  it('falls back to default season name when leaderboard is not available', () => {
    mockCommunityLeaderboards([]);

    const { result } = renderUseSeason();

    expect(result.current.season!.name).toBe(`Season ${MAX_SEASON_INDEX}`);
    expect(result.current.leaderboardId).toBeUndefined();
  });

  it('allows navigation to previous season', () => {
    const { result } = renderUseSeason();

    act(result.current.setPreviousSeason!);

    expect(result.current.season!.index).toBe(MAX_SEASON_INDEX - 1);
    expect(result.current.season!.name).toBe('Summer 2025');
    expect(result.current.season!.isLast).toBe(false);
    expect(result.current.season!.isFirst).toBe(false);
    expect(result.current.leaderboardId).toBe(333);
  });

  it('allows navigation to next season', () => {
    const { result } = renderUseSeason();

    act(result.current.setPreviousSeason!);
    act(result.current.setPreviousSeason!);

    expect(result.current.season!.index).toBe(MAX_SEASON_INDEX - 2);
    expect(result.current.season!.name).toBe('Spring 2025');
    expect(result.current.season!.isLast).toBe(false);
    expect(result.current.season!.isFirst).toBe(false);
    expect(result.current.leaderboardId).toBe(222);

    act(result.current.setNextSeason!);

    expect(result.current.season!.index).toBe(MAX_SEASON_INDEX - 1);
    expect(result.current.season!.name).toBe('Summer 2025');
    expect(result.current.season!.isLast).toBe(false);
    expect(result.current.season!.isFirst).toBe(false);
    expect(result.current.leaderboardId).toBe(333);
  });

  it('does not navigate before first season', () => {
    const { result } = renderUseSeason();

    // Navigate to first season
    act(() => {
      for (let i = MAX_SEASON_INDEX; i > MIN_SEASON_INDEX; i--) {
        result.current.setPreviousSeason!();
      }
    });

    expect(result.current.season!.index).toBe(MIN_SEASON_INDEX);
    expect(result.current.season!.isFirst).toBe(true);
    expect(result.current.season!.isLast).toBe(false);
    expect(result.current.leaderboardId).toBe(111);

    // Try to go before first season
    act(result.current.setPreviousSeason!);

    expect(result.current.season!.index).toBe(MIN_SEASON_INDEX);
  });

  it('does not navigate after last season', () => {
    const { result } = renderUseSeason();

    expect(result.current.season!.index).toBe(MAX_SEASON_INDEX);
    expect(result.current.season!.isLast).toBe(true);

    act(result.current.setNextSeason!);

    expect(result.current.season!.index).toBe(MAX_SEASON_INDEX);
  });
});
