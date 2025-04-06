import { renderHook } from '@testing-library/react-native';
import { act } from 'react';

import { useGetPlayerStatistics, useGetUserReadOnlyData } from '@/hooks/data';
import { Character } from '@/types/character';
import { StatisticName, UserData, UserStats } from '@/types/stats';

import { useUserStats } from './useUserStats';

jest.mock('@/hooks/data');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);
const useGetUserReadOnlyDataMock = jest.mocked(useGetUserReadOnlyData);

const characters = Object.values(Character);

const mockUserData: UserData = {
  characterData: characters.reduce((acc, character, index) => {
    acc[character] = { lvl: 5 + index * 10 };
    return acc;
  }, {} as UserData['characterData']),
};

describe('useUserStats', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as UserStats,
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

  it('should return loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: {} as UserStats,
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should return loading state when user data is loading', () => {
    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: {} as UserData,
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  it('should return nothing when statistics are not present', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('should return nothing when user data is not present', () => {
    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  it('should compute stats correctly from player statistics', () => {
    const mockStatistics: Partial<UserStats> = {
      [StatisticName.RANKED_S2_ELO]: 1500,
      [StatisticName.RANKED_S2_SETS]: 100,
      [StatisticName.RANKED_S2_WINS]: 60,
      [StatisticName.TOTAL_SESSIONS_PLAYED]: 200,
      [StatisticName.BETA_WINS]: 120,
    };

    const expectedStats = {
      rankedElo: 1500,
      rankedSetCount: 100,
      rankedWinCount: 60,
      rankedWinRate: 60,
      globalMatchCount: 200,
      globalWinCount: 120,
      globalWinRate: 60,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as UserStats,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toMatchObject(expectedStats);
  });

  it('should handle zero matches played when calculating win rates', () => {
    const mockStatistics: Partial<UserStats> = {
      [StatisticName.RANKED_S1_SETS]: 0,
      [StatisticName.RANKED_S1_WINS]: 0,
      [StatisticName.TOTAL_SESSIONS_PLAYED]: 0,
      [StatisticName.BETA_WINS]: 0,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as UserStats,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.stats?.rankedWinRate).toBe(0);
    expect(result.current.stats?.globalWinRate).toBe(0);
  });

  it('should pass through the refetch function correctly', async () => {
    const mockRefetchStatistics = jest.fn();
    const mockRefetchUserData = jest.fn();

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: mockRefetchStatistics,
      isLoading: false,
      isError: false,
    });

    useGetUserReadOnlyDataMock.mockReturnValue({
      userData: undefined,
      refetch: mockRefetchUserData,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    await act(async () => {
      result.current.refresh();
    });

    expect(mockRefetchStatistics).toHaveBeenCalledTimes(1);
    expect(mockRefetchUserData).toHaveBeenCalledTimes(1);
  });

  it('should compute character stats for all characters', () => {
    const mockStatistics: UserStats = characters.reduce((acc, character, index) => {
      const statKey = `${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName;
      acc[StatisticName[statKey]] = 10 + index * 5;
      return acc;
    }, {} as UserStats);

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as UserStats,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(useUserStats);

    expect(result.current.stats?.characterStats.length).toBe(characters.length);
    characters.forEach((character, index) => {
      const characterStat = result.current.stats?.characterStats.find((stat) => stat.character === character);
      expect(characterStat?.gameCount).toBe(10 + index * 5);
      expect(characterStat?.level).toBe(5 + index * 10);
    });
  });
});
