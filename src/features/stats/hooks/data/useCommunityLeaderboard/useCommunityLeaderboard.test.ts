import { renderHook, waitFor } from '@testing-library/react-native';
import { XMLBuilder } from 'fast-xml-parser';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useCommunityLeaderboard } from './useCommunityLeaderboard';

const renderUseCommunityLeaderboard = async (...props: Parameters<typeof useCommunityLeaderboard>) => {
  const { result } = renderHook(() => useCommunityLeaderboard(...props), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useCommunityLeaderboard', () => {
  it('returns empty leaderboard entries when leaderboardId is -1', async () => {
    const { result } = await renderUseCommunityLeaderboard(-1);

    expect(result.current.leaderboardEntries).toBeUndefined();
  });

  it('returns an empty leaderboard while the request is loading', async () => {
    const { result } = renderHook(() => useCommunityLeaderboard(123), { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.leaderboardEntries).toBeUndefined();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  describe('when the request succeeds', () => {
    it('returns the leaderboard entries for one request', async () => {
      fetchMock.getOnce('*', {
        status: 200,
        body: new XMLBuilder().build({
          resultCount: 3,
          totalLeaderboardEntries: 3,
          entryStart: 0,
          entryEnd: 3,
          entries: {
            entry: [
              { steamid: 123, score: 100, rank: 1 },
              { steamid: 456, score: 90, rank: 2 },
              { steamid: 789, score: 80, rank: 3 },
            ],
          },
        }),
      });

      const { result } = await renderUseCommunityLeaderboard(123);

      expect(result.current.leaderboardEntries).toEqual([
        { steamId: 123, position: 1, elo: 100 },
        { steamId: 456, position: 2, elo: 90 },
        { steamId: 789, position: 3, elo: 80 },
      ]);
    });

    it('returns the leaderboard entries for multiple requests', async () => {
      const resultBatches = [
        [
          { steamid: 123, score: 100, rank: 1 },
          { steamid: 456, score: 90, rank: 2 },
        ],
        [
          { steamid: 101112, score: 70, rank: 3 },
          { steamid: 131415, score: 60, rank: 4 },
        ],
        [
          { steamid: 789, score: 50, rank: 5 },
          { steamid: 321, score: 40, rank: 6 },
        ],
      ];

      resultBatches.forEach((batch, index) => {
        fetchMock.getOnce('*', {
          status: 200,
          body: new XMLBuilder().build({
            resultCount: 2,
            totalLeaderboardEntries: 6,
            entryStart: index * 2,
            entryEnd: index * 2 + 2,
            entries: {
              entry: batch,
            },
          }),
        });
      });

      const { result } = await renderUseCommunityLeaderboard(123);

      expect(result.current.leaderboardEntries).toEqual([
        { steamId: 123, position: 1, elo: 100 },
        { steamId: 456, position: 2, elo: 90 },
        { steamId: 101112, position: 3, elo: 70 },
        { steamId: 131415, position: 4, elo: 60 },
        { steamId: 789, position: 5, elo: 50 },
        { steamId: 321, position: 6, elo: 40 },
      ]);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.getOnce('*', { status: 500 });
    });

    it('returns an error state', async () => {
      const { result } = await renderUseCommunityLeaderboard(123);

      expect(result.current.leaderboardEntries).toBeUndefined();
    });
  });
});
