import { act, renderHook } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { TournamentState } from '../../../types/tournament';
import { useGetActiveTournaments } from '../../data/useGetActiveTournaments/useGetActiveTournaments';
import { useGetPastTournaments } from '../../data/useGetPastTournaments/useGetPastTournaments';
import { useTournamentsTab } from './useTournamentsTab';

jest.mock('../../data/useGetActiveTournaments/useGetActiveTournaments');
jest.mock('../../data/useGetPastTournaments/useGetPastTournaments');

const useGetActiveTournamentsMock = jest.mocked(useGetActiveTournaments);
const useGetPastTournamentsMock = jest.mocked(useGetPastTournaments);

const mockActiveTournaments = [
  {
    id: 1,
    name: 'Active Tournament 1',
    url: new URL('https://example.com/tournament/1'),
    imageUrl: new URL('https://example.com/image1.png'),
    countryCode: 'US',
    isOnline: true,
    numAttendees: 100,
    state: TournamentState.ONGOING,
    startAt: DateTime.fromISO('2025-01-01T00:00:00Z'),
    endAt: DateTime.fromISO('2025-01-05T23:59:59Z'),
    events: [],
  },
];

const mockPastTournaments = [
  {
    id: 2,
    name: 'Past Tournament 1',
    url: new URL('https://example.com/tournament/2'),
    imageUrl: new URL('https://example.com/image2.png'),
    countryCode: 'UK',
    isOnline: false,
    numAttendees: 50,
    state: TournamentState.COMPLETED,
    startAt: DateTime.fromISO('2024-12-01T00:00:00Z'),
    endAt: DateTime.fromISO('2024-12-05T23:59:59Z'),
    events: [],
  },
];

const mockRefetchActive = jest.fn();
const mockRefetchPast = jest.fn();

describe('useTournamentsTab', () => {
  beforeEach(() => {
    useGetActiveTournamentsMock.mockReturnValue({
      tournaments: [],
      isLoading: false,
      isError: false,
      refetch: mockRefetchActive,
      isRefetching: false,
    });

    useGetPastTournamentsMock.mockReturnValue({
      tournaments: [],
      isLoading: false,
      isError: false,
      refetch: mockRefetchPast,
      isRefetching: false,
    });
  });

  it('defaults to active tab', () => {
    const { result } = renderHook(() => useTournamentsTab());

    expect(result.current.selectedTab).toBe('active');
  });

  describe('when active tab is selected', () => {
    it('returns active tournaments', () => {
      useGetActiveTournamentsMock.mockReturnValue({
        tournaments: mockActiveTournaments,
        isLoading: false,
        isError: false,
        refetch: mockRefetchActive,
        isRefetching: false,
      });

      const { result } = renderHook(() => useTournamentsTab());

      expect(result.current.tournaments).toEqual(mockActiveTournaments);
    });

    it('returns loading state from active tournaments', () => {
      useGetActiveTournamentsMock.mockReturnValue({
        tournaments: [],
        isLoading: true,
        isError: false,
        refetch: mockRefetchActive,
        isRefetching: false,
      });

      const { result } = renderHook(() => useTournamentsTab());

      expect(result.current.isLoading).toBe(true);
    });

    it('returns refreshing state from active tournaments', () => {
      useGetActiveTournamentsMock.mockReturnValue({
        tournaments: mockActiveTournaments,
        isLoading: false,
        isError: false,
        refetch: mockRefetchActive,
        isRefetching: true,
      });

      const { result } = renderHook(() => useTournamentsTab());

      expect(result.current.isRefreshing).toBe(true);
    });

    it('returns error state from active tournaments', () => {
      useGetActiveTournamentsMock.mockReturnValue({
        tournaments: [],
        isLoading: false,
        isError: true,
        refetch: mockRefetchActive,
        isRefetching: false,
      });

      const { result } = renderHook(() => useTournamentsTab());

      expect(result.current.isError).toBe(true);
    });
  });

  describe('when past tab is selected', () => {
    it('returns past tournaments', () => {
      useGetPastTournamentsMock.mockReturnValue({
        tournaments: mockPastTournaments,
        isLoading: false,
        isError: false,
        refetch: mockRefetchPast,
        isRefetching: false,
      });

      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.selectPastTab();
      });

      expect(result.current.tournaments).toEqual(mockPastTournaments);
    });

    it('returns loading state from past tournaments', () => {
      useGetPastTournamentsMock.mockReturnValue({
        tournaments: [],
        isLoading: true,
        isError: false,
        refetch: mockRefetchPast,
        isRefetching: false,
      });

      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.selectPastTab();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('returns refreshing state from past tournaments', () => {
      useGetPastTournamentsMock.mockReturnValue({
        tournaments: mockPastTournaments,
        isLoading: false,
        isError: false,
        refetch: mockRefetchPast,
        isRefetching: true,
      });

      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.selectPastTab();
      });

      expect(result.current.isRefreshing).toBe(true);
    });

    it('returns error state from past tournaments', () => {
      useGetPastTournamentsMock.mockReturnValue({
        tournaments: [],
        isLoading: false,
        isError: true,
        refetch: mockRefetchPast,
        isRefetching: false,
      });

      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.selectPastTab();
      });

      expect(result.current.isError).toBe(true);
    });
  });

  describe('tab selection', () => {
    it('switches to active tab when selectActiveTab is called', () => {
      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.selectPastTab();
      });

      expect(result.current.selectedTab).toBe('past');

      act(() => {
        result.current.selectActiveTab();
      });

      expect(result.current.selectedTab).toBe('active');
    });

    it('switches to past tab when selectPastTab is called', () => {
      const { result } = renderHook(() => useTournamentsTab());

      expect(result.current.selectedTab).toBe('active');

      act(() => {
        result.current.selectPastTab();
      });

      expect(result.current.selectedTab).toBe('past');
    });
  });

  describe('refresh', () => {
    it('calls refetch for both active and past tournaments', () => {
      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.refresh();
      });

      expect(mockRefetchActive).toHaveBeenCalled();
      expect(mockRefetchPast).toHaveBeenCalled();
    });

    it('refetches both tournaments regardless of selected tab', () => {
      const { result } = renderHook(() => useTournamentsTab());

      act(() => {
        result.current.selectPastTab();
      });

      act(() => {
        result.current.refresh();
      });

      expect(mockRefetchActive).toHaveBeenCalled();
      expect(mockRefetchPast).toHaveBeenCalled();
    });
  });
});
