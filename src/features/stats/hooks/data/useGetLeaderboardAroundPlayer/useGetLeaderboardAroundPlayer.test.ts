import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { useSession } from '@/features/auth/contexts/SessionContext/SessionContext';
import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { StatisticName } from '../../../types/stats';
import { useGetLeaderboardAroundPlayer } from './useGetLeaderboardAroundPlayer';

jest.mock('@/features/auth/contexts/SessionContext/SessionContext');

const useSessionMock = jest.mocked(useSession);

const mockResponse = {
  data: {
    Leaderboard: [
      {
        StatValue: 2500,
        Position: 1,
        Profile: { DisplayName: 'Player1', AvatarUrl: 'https://www.example.com/avatars/player1.png' },
      },
      {
        StatValue: 2400,
        Position: 2,
        Profile: { DisplayName: 'Player2', AvatarUrl: 'https://www.example.com/avatars/player2.png' },
      },
      {
        StatValue: 2300,
        Position: 3,
        Profile: { DisplayName: 'Player3', AvatarUrl: 'https://www.example.com/avatars/player3.png' },
      },
    ],
  },
};

const defaultRequest = {
  maxResultCount: 100,
  statisticName: StatisticName.RANKED_S2_ELO,
};

const renderUseGetLeaderboardAroundPlayer = async (
  args: Parameters<typeof useGetLeaderboardAroundPlayer>[0] = defaultRequest,
) => {
  const { result } = renderHook(() => useGetLeaderboardAroundPlayer(args), { wrapper: TestQueryClientProvider });
  expect(result.current.isLoading).toBe(true);
  expect(result.current.playerPositions).toBeUndefined();
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetLeaderboardAroundPlayer', () => {
  beforeEach(() => {
    useSessionMock.mockReturnValue({} as ReturnType<typeof useSession>);
  });

  it('returns nothing when the request is loading', async () => {
    fetchMock.postOnce('*', mockResponse);

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    expect(result.current.playerPositions).toEqual([
      {
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2500,
        position: 1,
        profile: {
          playerName: 'Player1',
          avatarUrl: new URL('https://www.example.com/icon/https://www.example.com/avatars/player1.png'),
        },
      },
      {
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2400,
        position: 2,
        profile: {
          playerName: 'Player2',
          avatarUrl: new URL('https://www.example.com/icon/https://www.example.com/avatars/player2.png'),
        },
      },
      {
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2300,
        position: 3,
        profile: {
          playerName: 'Player3',
          avatarUrl: new URL('https://www.example.com/icon/https://www.example.com/avatars/player3.png'),
        },
      },
    ]);
    expect(result.current.isError).toBe(false);
  });

  it('fetches with custom parameters', async () => {
    fetchMock.postOnce('*', mockResponse);

    const { result } = await renderUseGetLeaderboardAroundPlayer({
      maxResultCount: 50,
      statisticName: StatisticName.RANKED_WINS,
    });

    expect(result.current.playerPositions).toBeDefined();
    expect(result.current.playerPositions![0].statisticName).toBe(StatisticName.RANKED_WINS);
    expect(result.current.isError).toBe(false);
  });

  it('handles API error', async () => {
    fetchMock.postOnce('*', 400);

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    expect(result.current.playerPositions).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });

  it('calls the query function again when refetching', async () => {
    fetchMock.postOnce('*', mockResponse);

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    fetchMock.postOnce('*', {
      data: {
        Leaderboard: [
          {
            StatValue: 2600,
            Position: 1,
            Profile: { DisplayName: 'NewPlayer1', AvatarUrl: 'https://www.example.com/avatars/newplayer1.png' },
          },
          {
            StatValue: 2550,
            Position: 2,
            Profile: { DisplayName: 'NewPlayer2', AvatarUrl: 'https://www.example.com/avatars/newplayer2.png' },
          },
        ],
      },
    });

    await result.current.refetch();

    await waitFor(() => expect(result.current.playerPositions).toHaveLength(2));
    expect(result.current.playerPositions).toEqual([
      {
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2600,
        position: 1,
        profile: {
          playerName: 'NewPlayer1',
          avatarUrl: new URL('https://www.example.com/avatars/newplayer1.png'),
        },
      },
      {
        statisticName: StatisticName.RANKED_S2_ELO,
        statisticValue: 2550,
        position: 2,
        profile: {
          playerName: 'NewPlayer2',
          avatarUrl: new URL('https://www.example.com/avatars/newplayer2.png'),
        },
      },
    ]);
    expect(result.current.isError).toBe(false);
  });

  it('returns error when response has no leaderboard', async () => {
    fetchMock.postOnce('*', { Leaderboard: [] });

    const { result } = await renderUseGetLeaderboardAroundPlayer();

    expect(result.current.playerPositions).toBeUndefined();
    expect(result.current.isError).toBe(true);
  });
});
