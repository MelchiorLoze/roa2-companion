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

const defaultActiveTournamentsReturnValue: ReturnType<typeof useGetActiveTournaments> = {
  tournaments: undefined,
  isLoading: false,
  refetch: mockRefetchActive,
  isRefetching: false,
};

const defaultPastTournamentsReturnValue: ReturnType<typeof useGetPastTournaments> = {
  tournaments: undefined,
  isLoading: false,
  refetch: mockRefetchPast,
  isRefetching: false,
};

describe('useTournamentsTab', () => {
  beforeEach(() => {
    useGetActiveTournamentsMock.mockReturnValue(defaultActiveTournamentsReturnValue);
    useGetPastTournamentsMock.mockReturnValue(defaultPastTournamentsReturnValue);
  });

  it('defaults to active tab', async () => {
    const { result } = await renderHook(() => useTournamentsTab());

    expect(result.current.selectedTab).toBe('active');
  });

  it('returns tabs array with active and past tabs', async () => {
    const { result } = await renderHook(() => useTournamentsTab());

    expect(result.current.tabs).toHaveLength(2);
    expect(result.current.tabs[0].label).toBe('active');
    expect(result.current.tabs[1].label).toBe('past');
    expect(typeof result.current.tabs[0].onPress).toBe('function');
    expect(typeof result.current.tabs[1].onPress).toBe('function');
  });

  describe('when active tab is selected', () => {
    it('returns active tournaments', async () => {
      useGetActiveTournamentsMock.mockReturnValue({
        ...defaultActiveTournamentsReturnValue,
        tournaments: mockActiveTournaments,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      expect(result.current.tournaments).toEqual(mockActiveTournaments);
    });

    it('returns loading state from active tournaments', async () => {
      useGetActiveTournamentsMock.mockReturnValue({
        ...defaultActiveTournamentsReturnValue,
        isLoading: true,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      expect(result.current.isLoading).toBe(true);
    });

    it('returns refreshing state from active tournaments', async () => {
      useGetActiveTournamentsMock.mockReturnValue({
        ...defaultActiveTournamentsReturnValue,
        tournaments: mockActiveTournaments,
        isRefetching: true,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      expect(result.current.isRefreshing).toBe(true);
    });

    it('returns error state when tournaments are undefined and not loading', async () => {
      useGetActiveTournamentsMock.mockReturnValue({
        ...defaultActiveTournamentsReturnValue,
        tournaments: undefined,
        isLoading: false,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      expect(result.current.isError).toBe(true);
    });
  });

  describe('when past tab is selected', () => {
    it('returns past tournaments', async () => {
      useGetPastTournamentsMock.mockReturnValue({
        ...defaultPastTournamentsReturnValue,
        tournaments: mockPastTournaments,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');

      await act(pastTab!.onPress);

      expect(result.current.tournaments).toEqual(mockPastTournaments);
    });

    it('returns loading state from past tournaments', async () => {
      useGetPastTournamentsMock.mockReturnValue({
        ...defaultPastTournamentsReturnValue,
        isLoading: true,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');

      await act(pastTab!.onPress);

      expect(result.current.isLoading).toBe(true);
    });

    it('returns refreshing state from past tournaments', async () => {
      useGetPastTournamentsMock.mockReturnValue({
        ...defaultPastTournamentsReturnValue,
        tournaments: mockPastTournaments,
        isRefetching: true,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');

      await act(pastTab!.onPress);

      expect(result.current.isRefreshing).toBe(true);
    });

    it('returns error state when tournaments are undefined and not loading', async () => {
      useGetPastTournamentsMock.mockReturnValue({
        ...defaultPastTournamentsReturnValue,
        tournaments: undefined,
        isLoading: false,
      });

      const { result } = await renderHook(() => useTournamentsTab());

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');

      await act(pastTab!.onPress);

      expect(result.current.isError).toBe(true);
    });
  });

  describe('tab selection', () => {
    it('switches to active tab when active tab is pressed', async () => {
      const { result } = await renderHook(() => useTournamentsTab());

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');
      const activeTab = result.current.tabs.find((tab) => tab.label === 'active');

      await act(pastTab!.onPress);

      expect(result.current.selectedTab).toBe('past');

      await act(activeTab!.onPress);

      expect(result.current.selectedTab).toBe('active');
    });

    it('switches to past tab when past tab is pressed', async () => {
      const { result } = await renderHook(() => useTournamentsTab());

      expect(result.current.selectedTab).toBe('active');

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');

      await act(pastTab!.onPress);

      expect(result.current.selectedTab).toBe('past');
    });
  });

  describe('refresh', () => {
    it('calls refetch for both active and past tournaments', async () => {
      const { result } = await renderHook(() => useTournamentsTab());

      await act(result.current.refresh);

      expect(mockRefetchActive).toHaveBeenCalled();
      expect(mockRefetchPast).toHaveBeenCalled();
    });

    it('refetches both tournaments regardless of selected tab', async () => {
      const { result } = await renderHook(() => useTournamentsTab());

      const pastTab = result.current.tabs.find((tab) => tab.label === 'past');

      await act(pastTab!.onPress);

      await act(result.current.refresh);

      expect(mockRefetchActive).toHaveBeenCalled();
      expect(mockRefetchPast).toHaveBeenCalled();
    });
  });
});
