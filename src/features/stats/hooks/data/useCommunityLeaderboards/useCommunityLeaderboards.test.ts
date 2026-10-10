import { renderHook, waitFor } from '@testing-library/react-native';
import XMLBuilder from 'fast-xml-builder';
import fetchMock from 'fetch-mock';

import { deferred } from '@/test-helpers/deferred';
import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { useCommunityLeaderboards } from './useCommunityLeaderboards';

const renderUseCommunityLeaderboards = async () => {
  const { result } = await renderHook(useCommunityLeaderboards, { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useCommunityLeaderboards', () => {
  it('returns empty array when the request is loading', async () => {
    const response = deferred();
    fetchMock.anyOnce(async () => {
      await response.promise;
      return { status: 400 };
    });

    const { result } = await renderHook(useCommunityLeaderboards, { wrapper: TestQueryClientProvider });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.leaderboards).toBeUndefined();

    response.resolve();
    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock.getOnce('*', {
        status: 200,
        body: new XMLBuilder().build({
          response: {
            leaderboard: [
              { lbid: 1, name: 'Leaderboard 1', display_name: 'Leaderboard One', entries: 100 },
              { lbid: 2, name: 'Leaderboard 2', display_name: 'Leaderboard Two', entries: 200 },
            ],
          },
        }),
      });
    });

    it('returns the community leaderboards', async () => {
      const { result } = await renderUseCommunityLeaderboards();

      expect(result.current.leaderboards).toEqual([
        { id: 1, name: 'Leaderboard 1', displayName: 'Leaderboard One', entryCount: 100 },
        { id: 2, name: 'Leaderboard 2', displayName: 'Leaderboard Two', entryCount: 200 },
      ]);
    });
  });

  describe('when the request fails', () => {
    beforeEach(() => {
      fetchMock.getOnce('*', { status: 500 });
    });

    it('returns an error state', async () => {
      const { result } = await renderUseCommunityLeaderboards();

      expect(result.current.leaderboards).toBeUndefined();
    });
  });
});
