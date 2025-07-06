import { renderHook } from '@testing-library/react-native';
import { act } from 'react';

import { Character } from '@/types/character';

import { useSeason } from '../../../contexts/SeasonContext/SeasonContext';
import { Rank } from '../../../types/rank';
import { type PlayerPosition, type PlayerStatistics, StatisticName, type UserData } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from '../../data/useGetLeaderboardAroundPlayer/useGetLeaderboardAroundPlayer';
import { useGetPlayerStatistics } from '../../data/useGetPlayerStatistics/useGetPlayerStatistics';
import { useGetUserReadOnlyData } from '../../data/useGetUserReadOnlyData/useGetUserReadOnlyData';
import { useUserStats } from './useUserStats';

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

jest.mock('../../data/useGetUserReadOnlyData/useGetUserReadOnlyData');
const useGetUserReadOnlyDataMock = jest.mocked(useGetUserReadOnlyData);

const mockedPlayerPositions: PlayerPosition[] = [
  {
    playerName: 'Player1',
    statisticName: StatisticName.RANKED_S2_ELO,
    statisticValue: 916,
    position: 4404,
  },
];

const characters = Object.values(Character);

const mockUserData: UserData = {
  characterData: characters.reduce(
    (acc, character, index) => {
      acc[character] = { lvl: 5 + index * 10 };
      return acc;
    },
    {} as Record<Character, { lvl: number }>,
  ),
};

const renderUseUserStats = () => {
  const { result } = renderHook(useUserStats);

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useGetPlayerStatisticsMock).toHaveBeenCalledTimes(1);
  expect(useGetLeaderboardAroundPlayerMock).toHaveBeenCalledTimes(1);
  expect(useGetLeaderboardAroundPlayerMock).toHaveBeenCalledWith({
    maxResultCount: 1,
    statisticName: StatisticName.RANKED_S2_ELO,
  });
  expect(useGetUserReadOnlyDataMock).toHaveBeenCalledTimes(1);

  return { result };
};

describe('useUserStats', () => {
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

    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: mockUserData,
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

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rankedStats).toBeUndefined();
    expect(result.current.globalStats).toBeUndefined();
    expect(result.current.characterStats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('returns loading state when player positions are loading', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rankedStats).toBeUndefined();
    expect(result.current.globalStats).toBeUndefined();
    expect(result.current.characterStats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('returns loading state when user data is loading', () => {
    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: {} as UserData,
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.rankedStats).toBeUndefined();
    expect(result.current.globalStats).toBeUndefined();
    expect(result.current.characterStats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('returns nothing when statistics are not present', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.rankedStats).toBeUndefined();
    expect(result.current.globalStats).toBeUndefined();
    expect(result.current.characterStats).toBeUndefined();
  });

  it('returns nothing when player positions are not present', () => {
    useGetLeaderboardAroundPlayerMock.mockReturnValue({
      playerPositions: [],
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.rankedStats).toBeUndefined();
    expect(result.current.globalStats).not.toBeUndefined();
    expect(result.current.characterStats).not.toBeUndefined();
  });

  it('returns nothing when user data is not present', () => {
    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.rankedStats).not.toBeUndefined();
    expect(result.current.globalStats).not.toBeUndefined();
    expect(result.current.characterStats).toBeUndefined();
  });

  it('computes stats correctly from player statistics', () => {
    const mockStatistics: Partial<PlayerStatistics> = {
      [StatisticName.RANKED_S1_ELO]: 815,
      [StatisticName.RANKED_S1_SETS]: 200,
      [StatisticName.RANKED_S1_WINS]: 22,
      [StatisticName.RANKED_S2_ELO]: 915,
      [StatisticName.RANKED_SETS]: 100,
      [StatisticName.RANKED_WINS]: 60,
      [StatisticName.TOTAL_SESSIONS_PLAYED]: 200,
      [StatisticName.BETA_WINS]: 120,
    };

    const expectedRankedStats = {
      position: 4404,
      rank: Rank.GOLD,
      elo: 915,
      setStats: { setCount: 100, winCount: 60, winRate: 60 },
    };

    const expectedGlobalStats = {
      gameStats: { gameCount: 200, winCount: 120, winRate: 60 },
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.rankedStats).toMatchObject(expectedRankedStats);
    expect(result.current.globalStats).toMatchObject(expectedGlobalStats);
  });

  it('handles zero matches played when calculating win rates', () => {
    const mockStatistics: Partial<PlayerStatistics> = {
      [StatisticName.RANKED_S1_SETS]: 0,
      [StatisticName.RANKED_S1_WINS]: 0,
      [StatisticName.TOTAL_SESSIONS_PLAYED]: 0,
      [StatisticName.BETA_WINS]: 0,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as PlayerStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.rankedStats?.setStats?.winRate).toBe(0);
    expect(result.current.globalStats?.gameStats.winRate).toBe(0);
  });

  it('pass through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();
    const mockRefetchPlayerPositions = jest.fn();
    const mockRefetchUserData = jest.fn();

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

    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: undefined,
      refetch: mockRefetchUserData,
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    await act(async () => result.current.refresh());

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
    expect(mockRefetchPlayerPositions).toHaveBeenCalledTimes(1);
    expect(mockRefetchUserData).toHaveBeenCalledTimes(1);
  });

  it('computes character stats for all characters', () => {
    const mockStatistics: PlayerStatistics = characters.reduce((acc, character, index) => {
      const statKey = `${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName;
      acc[StatisticName[statKey]] = 10 + index * 5;
      return acc;
    }, {} as PlayerStatistics);

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderUseUserStats();

    expect(result.current.characterStats?.length).toBe(characters.length);
    characters.forEach((character, index) => {
      const characterStat = result.current.characterStats?.find((stat) => stat.character === character);
      expect(characterStat?.gameCount).toBe(10 + index * 5);
      expect(characterStat?.level).toBe(5 + index * 10);
    });
  });
});
