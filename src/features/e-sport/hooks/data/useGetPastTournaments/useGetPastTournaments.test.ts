import { renderHook, waitFor } from '@testing-library/react-native';
import fetchMock from 'fetch-mock';

import { TestQueryClientProvider } from '@/test-helpers/TestQueryClientProvider';

import { type TournamentDto, TournamentState } from '../../../types/tournament';
import { useGetPastTournaments } from './useGetPastTournaments';

const mockTournamentDto: TournamentDto = {
  id: 1,
  name: 'Test Tournament',
  url: 'https://example.com/tournament/1',
  imageUrl: 'https://example.com/image.png',
  countryCode: 'US',
  isOnline: true,
  numAttendees: 100,
  state: TournamentState.ONGOING,
  startAt: '2025-01-01T00:00:00Z',
  endAt: '2025-01-05T23:59:59Z',
  events: [
    {
      id: 1,
      name: 'Event 1',
      numEntrants: 50,
      startAt: '2025-01-02T10:00:00Z',
    },
  ],
};

const renderUseGetPastTournaments = async () => {
  const { result } = renderHook(() => useGetPastTournaments(), { wrapper: TestQueryClientProvider });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  return { result };
};

describe('useGetPastTournaments', () => {
  describe('returns empty array', () => {
    it('when the request is loading', async () => {
      const { result } = renderHook(() => useGetPastTournaments(), { wrapper: TestQueryClientProvider });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.tournaments).toEqual([]);
      expect(result.current.isError).toBe(false);
      await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('when the request fails', async () => {
      fetchMock.getOnce('*', 400);

      const { result } = await renderUseGetPastTournaments();

      expect(result.current.tournaments).toEqual([]);
      expect(result.current.isError).toBe(true);
    });

    it('when no tournaments are returned', async () => {
      fetchMock.getOnce('*', {
        content: [],
      });

      const { result } = await renderUseGetPastTournaments();

      expect(result.current.tournaments).toEqual([]);
      expect(result.current.isError).toBe(false);
    });
  });

  describe('when the request succeeds', () => {
    it('returns tournaments', async () => {
      fetchMock.getOnce('*', {
        content: [mockTournamentDto],
      });

      const { result } = await renderUseGetPastTournaments();

      expect(result.current.tournaments).toHaveLength(1);
      expect(result.current.tournaments[0].id).toBe(1);
      expect(result.current.tournaments[0].name).toBe('Test Tournament');
      expect(result.current.tournaments[0].url.toString()).toBe('https://example.com/tournament/1');
      expect(result.current.isError).toBe(false);
    });

    it('sorts events by numEntrants in descending order', async () => {
      const tournamentWithMultipleEvents: TournamentDto = {
        ...mockTournamentDto,
        events: [
          {
            id: 1,
            name: 'Event 1',
            numEntrants: 30,
            startAt: '2025-01-02T10:00:00Z',
          },
          {
            id: 2,
            name: 'Event 2',
            numEntrants: 50,
            startAt: '2025-01-03T10:00:00Z',
          },
          {
            id: 3,
            name: 'Event 3',
            numEntrants: 40,
            startAt: '2025-01-04T10:00:00Z',
          },
        ],
      };

      fetchMock.getOnce('*', {
        content: [tournamentWithMultipleEvents],
      });

      const { result } = await renderUseGetPastTournaments();

      expect(result.current.tournaments[0].events).toHaveLength(3);
      expect(result.current.tournaments[0].events[0].numEntrants).toBe(50);
      expect(result.current.tournaments[0].events[1].numEntrants).toBe(40);
      expect(result.current.tournaments[0].events[2].numEntrants).toBe(30);
    });
  });
});
