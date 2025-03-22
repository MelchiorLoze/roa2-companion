import { renderHook } from '@testing-library/react-native';
import { act } from 'react';

import { useGetPlayerStatistics } from '@/hooks/data/useGetPlayerStatistics/useGetPlayerStatistics';
import { Character } from '@/types/character';
import { PlayerStats, StatisticName } from '@/types/stats';

import { usePlayerStats } from './usePlayerStats';

jest.mock('@/hooks/data/useGetPlayerStatistics/useGetPlayerStatistics');
const useGetPlayerStatisticsMock = jest.mocked(useGetPlayerStatistics);

describe('usePlayerStats', () => {
  beforeEach(() => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });
  });

  test('should return loading state when statistics are loading', () => {
    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: jest.fn(),
      isLoading: true,
      isError: false,
    });

    const { result } = renderHook(() => usePlayerStats());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.stats).toBeUndefined();
    expect(typeof result.current.refresh).toBe('function');
  });

  test('should return undefined stats when statistics are null', () => {
    const { result } = renderHook(() => usePlayerStats());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toBeUndefined();
  });

  test('should compute stats correctly from player statistics', () => {
    const mockStatistics: Partial<PlayerStats> = {
      [StatisticName.RANKED_SEASON_ELO]: 1500,
      [StatisticName.RANKED_SEASON_MATCHES]: 100,
      [StatisticName.RANKED_SEASON_WINS]: 60,
      [StatisticName.TOTAL_SESSIONS_PLAYED]: 200,
      [StatisticName.BETA_WINS]: 120,
    };

    const expectedStats = {
      rankedElo: 1500,
      rankedMatchCount: 100,
      rankedWinCount: 60,
      rankedWinRate: 60,
      globalMatchCount: 200,
      globalWinCount: 120,
      globalWinRate: 60,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as PlayerStats,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => usePlayerStats());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.stats).toMatchObject(expectedStats);
  });

  test('should handle zero matches played when calculating win rates', () => {
    const mockStatistics: Partial<PlayerStats> = {
      [StatisticName.RANKED_SEASON_MATCHES]: 0,
      [StatisticName.RANKED_SEASON_WINS]: 0,
      [StatisticName.TOTAL_SESSIONS_PLAYED]: 0,
      [StatisticName.BETA_WINS]: 0,
    };

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as PlayerStats,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => usePlayerStats());

    expect(result.current.stats?.rankedWinRate).toBe(0);
    expect(result.current.stats?.globalWinRate).toBe(0);
  });

  test('should pass through the refetch function correctly', async () => {
    const mockRefetch = jest.fn();

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: undefined,
      refetch: mockRefetch,
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => usePlayerStats());

    await act(async () => {
      result.current.refresh();
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  test('should compute gamesPlayedPerCharacter for all characters', () => {
    const mockStatistics: Partial<PlayerStats> = {};

    const realCharacters = Object.values(Character);
    realCharacters.forEach((character, index) => {
      const statKey = `${character.toUpperCase()}_MATCH_COUNT` as keyof typeof StatisticName;
      mockStatistics[StatisticName[statKey]] = 10 + index * 5;
    });

    useGetPlayerStatisticsMock.mockReturnValue({
      statistics: mockStatistics as PlayerStats,
      refetch: jest.fn(),
      isLoading: false,
      isError: false,
    });

    const { result } = renderHook(() => usePlayerStats());

    expect(result.current.stats?.gamesPlayedPerCharacter.length).toBe(realCharacters.length);
    realCharacters.forEach((character, index) => {
      const characterStat = result.current.stats?.gamesPlayedPerCharacter.find((stat) => stat.character === character);
      expect(characterStat?.value).toBe(10 + index * 5);
    });
  });
});
