import { act, renderHook } from '@testing-library/react-native';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { Rank } from '../../../types/rank';
import { type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useLeaderboardStats } from '../useLeaderboardStats/useLeaderboardStats';
import { useUserRankedStats } from './useUserRankedStats';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('../../../types/stats', () => ({
  ...jest.requireActual('../../../types/stats'),
  MIN_SEASON_INDEX: 1,
  MAX_SEASON_INDEX: 2,
}));

jest.mock('../../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const defaultSeasonState: ReturnType<typeof useSeason> = {
  season: {
    index: 2,
    name: 'Season 2',
    isFirst: false,
    isLast: false,
  },
  leaderboardId: 789,
  isLoading: false,
  setPreviousSeason: jest.fn(),
  setNextSeason: jest.fn(),
};

jest.mock('../../data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);
const defaultPlayerStatisticsState: ReturnType<typeof useGetPlayerStatistics> = {
  statistics: {
    [StatisticName.RANKED_S2_ELO]: 925,
    [StatisticName.RANKED_SETS]: 100,
    [StatisticName.RANKED_WINS]: 75,
  },
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
  isError: false,
};

jest.mock('../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer');
const useGetLeaderboardAroundPlayerMock = jest.mocked(useGetLeaderboardAroundPlayer);
const defaultLeaderboardAroundPlayerState: ReturnType<typeof useGetLeaderboardAroundPlayer> = {
  playerPositions: [
    {
      playerName: 'Player1',
      statisticName: StatisticName.RANKED_S2_ELO,
      statisticValue: 916,
      position: 4404,
    },
  ],
  refetch: jest.fn(),
  isLoading: false,
  isRefetching: false,
  isError: false,
};

jest.mock('../../business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsMock: ReturnType<typeof useLeaderboardStats> = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
};

const renderUseUserRankedStats = () => {
  const { result } = renderHook(useUserRankedStats);

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);
  expect(useGetLeaderboardAroundPlayerMock).toHaveBeenCalledTimes(1);
  expect(useGetLeaderboardAroundPlayerMock).toHaveBeenCalledWith({
    maxResultCount: 1,
    statisticName: StatisticName.RANKED_S2_ELO,
  });
  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserRankedStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonState);
    useGetPlayerStatisticsMock.mockReturnValue(defaultPlayerStatisticsState);
    useGetLeaderboardAroundPlayerMock.mockReturnValue(defaultLeaderboardAroundPlayerState);
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsMock);
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      ...defaultPlayerStatisticsState,
      statistics: undefined,
      isLoading: true,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toEqual({
      elo: undefined,
      rank: undefined,
      position: 4404,
      playerCount: 21,
      setStats: undefined,
    });
  });

  it('returns loading state when leaderboard data is loading', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      ...defaultLeaderboardAroundPlayerState,
      playerPositions: [],
      isLoading: true,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isRefreshing).toBe(false);
    expect(result.current.stats).toEqual({
      elo: 925,
      rank: undefined,
      position: undefined,
      playerCount: 21,
      setStats: { setCount: 100, winCount: 75, winRate: 75 },
    });
  });

  it('returns refetching state when statistics are being refetched', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: true,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
  });

  it('returns refetching state when leaderboard data is being refetched', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      ...defaultLeaderboardAroundPlayerState,
      isRefetching: true,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isRefreshing).toBe(true);
  });

  it('computes ranked stats correctly from player statistics', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.RANKED_S1_ELO]: 815,
      [StatisticName.RANKED_S1_SETS]: 200,
      [StatisticName.RANKED_S1_WINS]: 22,
      [StatisticName.RANKED_S2_ELO]: 915,
      [StatisticName.RANKED_SETS]: 100,
      [StatisticName.RANKED_WINS]: 60,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toEqual({
      elo: 915,
      rank: Rank.GOLD,
      position: 4404,
      playerCount: 21,
      setStats: { setCount: 100, winCount: 60, winRate: 60 },
    });
  });

  it('handles zero matches played when calculating win rates', () => {
    const mockStatistics: PlayerStatistics = {
      [StatisticName.RANKED_SETS]: 0,
      [StatisticName.RANKED_WINS]: 0,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.stats?.setStats?.winRate).toBe(0);
  });

  it('passes through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: mockRefetchStatistics,
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
  });

  it('returns undefined elo and rank when elo stat is not present', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {
        [StatisticName.RANKED_SETS]: 10,
        [StatisticName.RANKED_WINS]: 3,
      } as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isRefetching: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats?.elo).toBeUndefined();
    expect(result.current.stats?.rank).toBeUndefined();
  });
});
