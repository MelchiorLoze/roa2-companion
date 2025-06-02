import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';
import { StatisticName } from '@/types/stats';

import { useGetLeaderboardAroundPlayer } from './useGetLeaderboardAroundPlayer';

jest.mock('@/features/auth/contexts/SessionContext/SessionContext', () => ({
  useSession: jest.fn().mockReturnValue({}),
}));

const mockResponse = {
  data: {
    Leaderboard: [
      { DisplayName: 'Player1', StatValue: 2500, Position: 1 },
      { DisplayName: 'Player2', StatValue: 2400, Position: 2 },
      { DisplayName: 'Player3', StatValue: 2300, Position: 3 },
    ],
  },
};

const renderUseGetLeaderboardAroundPlayer = async (args?: Parameters<typeof useGetLeaderboardAroundPlayer>[0]) => {
  const { result } = renderHook(() => useGetLeaderboardAroundPlayer(args), { wrapper: TestQueryClientProvider });
  expect(result.current.isLoading).toBe(true);
  expect(result.current.playerPositions).toEqual([]);
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetLeaderboardAroundPlayer', () => {
  it('fetches and transform leaderboard data with default params', async () => {
    fetchMock.postOnce('*', mockResponse);

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    expect(result.current.playerPositions).toEqual([
      {
        playerName: 'Player1',
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2500,
        position: 1,
      },
      {
        playerName: 'Player2',
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2400,
        position: 2,
      },
      {
        playerName: 'Player3',
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2300,
        position: 3,
      },
    ]);
    expect(result.current.isError).toBe(false);
  });

  it('fetches with custom parameters', async () => {
    fetchMock.postOnce('*', mockResponse);

    const { result } = await renderUseGetLeaderboardAroundPlayer({
      maxResultCount: 50,
      statisticName: StatisticName.RANKED_S2_WINS,
    });

    expect(result.current.playerPositions[0].statisticName).toBe(StatisticName.RANKED_S2_WINS);
    expect(result.current.isError).toBe(false);
  });

  it('handles API error', async () => {
    fetchMock.postOnce('*', 400);

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    expect(result.current.playerPositions).toEqual([]);
    expect(result.current.isError).toBe(true);
  });

  it('calls the query function again when refetching', async () => {
    fetchMock.postOnce('*', mockResponse);

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    fetchMock.postOnce('*', {
      data: {
        Leaderboard: [
          { DisplayName: 'NewPlayer1', StatValue: 2600, Position: 1 },
          { DisplayName: 'NewPlayer2', StatValue: 2550, Position: 2 },
        ],
      },
    });

    await result.current.refetch();

    await waitFor(() => expect(result.current.playerPositions).toHaveLength(2));
    expect(result.current.playerPositions).toEqual([
      {
        playerName: 'NewPlayer1',
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2600,
        position: 1,
      },
      {
        playerName: 'NewPlayer2',
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2550,
        position: 2,
      },
    ]);
    expect(result.current.isError).toBe(false);
  });

  it('returns empty array when response has no leaderboard', async () => {
    fetchMock.postOnce('*', { Leaderboard: [] });

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    expect(result.current.playerPositions).toEqual([]);
    expect(result.current.isError).toBe(false);
  });
});
