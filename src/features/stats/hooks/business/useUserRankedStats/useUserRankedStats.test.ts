import { act, renderHook } from '@testing-library/react-native';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { Rank } from '../../../types/rank';
import { type PlayerPosition, type PlayerStatistics, StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useUserRankedStats } from './useUserRankedStats';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('../../../types/stats', () => ({
  ...jest.requireActual('../../../types/stats'),
  MAX_SEASON_INDEX: 2,
  MIN_SEASON_INDEX: 1,
}));

jest.mock('../../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const defaultSeasonState = {
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

jest.mock('../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer');
const useGetLeaderboardAroundPlayerMock = jest.mocked(useGetLeaderboardAroundPlayer);

const mockedPlayerPositions: PlayerPosition[] = [
  {
    playerName: 'Player1',
    statisticName: StatisticName.RANKED_S2_ELO,
    statisticValue: 916,
    position: 4404,
  },
];

const renderUseUserRankedStats = () => {
  const { result } = renderHook(useUserRankedStats);

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);
  expect(useGetLeaderboardAroundPlayerMock).toHaveBeenCalledTimes(1);
  expect(useGetLeaderboardAroundPlayerMock).toHaveBeenCalledWith({
    maxResultCount: 1,
    statisticName: StatisticName.RANKED_S2_ELO,
  });

  return { result };
};

describe('useUserRankedStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonState);

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: mockedPlayerPositions,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });
  });

  it('returns loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('returns loading state when player positions are loading', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('returns nothing when statistics are not present', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('returns nothing when player positions are not present', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toBeUndefined();
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

    const expectedRankedStats = {
      position: 4404,
      rank: Rank.GOLD,
      elo: 915,
      setStats: { setCount: 100, winCount: 60, winRate: 60 },
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toMatchObject(expectedRankedStats);
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
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.stats?.setStats?.winRate).toBe(0);
  });

  it('pass through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();
    const mockRefetchPlayerPositions = jest.fn();

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: mockRefetchStatistics,
      isLoading: false,
      isError: false,
    });

    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: mockedPlayerPositions,
      refetch: mockRefetchPlayerPositions,
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
    expect(mockRefetchPlayerPositions).toHaveBeenCalledTimes(1);
  });

  it('returns undefined elo and rank when win count is less than 4', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {
        [StatisticName.RANKED_S2_ELO]: 925,
        [StatisticName.RANKED_SETS]: 10,
        [StatisticName.RANKED_WINS]: 3,
      } as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserRankedStats();

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats?.elo).toBeUndefined();
    expect(result.current.stats?.rank).toBeUndefined();
  });
});
