import { fireEvent, render, screen } from '@testing-library/react-native';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserRankedStats } from '../../hooks/business/useUserRankedStats/useUserRankedStats';
import { Rank } from '../../types/rank';
import { RankedStats } from './RankedStats';

jest.mock('../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const setPreviousSeasonMock = jest.fn();
const setNextSeasonMock = jest.fn();
const defaultSeasonReturnValue: ReturnType<typeof useSeason> = {
  season: {
    index: 5,
    name: 'Season 5',
    isFirst: false,
    isLast: false,
  },
  leaderboardId: 789,
  isLoading: false,
  setPreviousSeason: setPreviousSeasonMock,
  setNextSeason: setNextSeasonMock,
};

jest.mock('../../hooks/business/useUserRankedStats/useUserRankedStats');
const useUserRankedStatsMock = jest.mocked(useUserRankedStats);
const defaultUserRankedStatsState: ReturnType<typeof useUserRankedStats> = {
  stats: {
    elo: 925,
    rank: Rank.GOLD,
    position: 123,
    playerCount: 1000,
    setStats: { setCount: 100, winCount: 75, winRate: 75 },
    bestWinStreak: 20,
    profile: {
      playerName: 'Player1',
      avatarUrl: new URL('https://www.example.com/icon/player1.png'),
    },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

jest.mock('../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
useLeaderboardStatsMock.mockReturnValue({
  firstPlayerElo: 1000,
  lastPlayerElo: -1000,
  lastAethereanElo: 1800,
  leaderboardEntries: [],
  isLoading: false,
});

const renderComponent = () => {
  render(<RankedStats />);

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useUserRankedStatsMock).toHaveBeenCalledTimes(1);
};

describe('RankedStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonReturnValue);
    useUserRankedStatsMock.mockReturnValue(defaultUserRankedStatsState);
  });

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('Ranked - Season 5')).toBeTruthy();
    expect(screen.getByText('S5')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2); // Previous and Next season buttons

    expect(screen.getByText('123')).toBeTruthy();
    expect(screen.getByText('Player1')).toBeTruthy();
    expect(screen.getByText('925')).toBeTruthy();
    expect(screen.queryByText('UNRANKED')).toBeNull();

    expect(screen.getByText('Ranked wins')).toBeTruthy();
    expect(screen.getByText('75')).toBeTruthy();

    expect(screen.getByText('Ranked losses')).toBeTruthy();
    expect(screen.getByText('25')).toBeTruthy();

    expect(screen.getByText('Ranked win rate')).toBeTruthy();
    expect(screen.getByText('75.00%')).toBeTruthy();

    expect(screen.getByText('Best win streak')).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();

    expect(screen.getByText('Top 12.30%')).toBeTruthy();
  });

  it('does not allow to switch to previous session when already at the first', () => {
    useSeasonMock.mockReturnValue({
      ...defaultSeasonReturnValue,
      season: {
        ...defaultSeasonReturnValue.season,
        isFirst: true,
        isLast: false,
      },
    });

    renderComponent();

    const [prevButton, nextButton] = screen.getAllByRole('button');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });

  it('does not allow to switch to next session when already at the last', () => {
    useSeasonMock.mockReturnValue({
      ...defaultSeasonReturnValue,
      season: {
        ...defaultSeasonReturnValue.season,
        isFirst: false,
        isLast: true,
      },
    });

    renderComponent();

    const [prevButton, nextButton] = screen.getAllByRole('button');

    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
  });

  it('allows navigation between seasons', () => {
    renderComponent();

    const [prevButton, nextButton] = screen.getAllByRole('button');

    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeEnabled();

    fireEvent.press(prevButton);
    expect(setPreviousSeasonMock).toHaveBeenCalledTimes(1);

    fireEvent.press(nextButton);
    expect(setNextSeasonMock).toHaveBeenCalledTimes(1);
  });

  it('displays loading spinner when stats are loading', () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsState,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('displays UNRANKED when elo is undefined', () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsState,
      stats: {
        ...defaultUserRankedStatsState.stats,
        elo: undefined,
        rank: undefined,
      } as typeof defaultUserRankedStatsState.stats,
    });

    renderComponent();

    expect(screen.getByText('123')).toBeTruthy();
    expect(screen.getByText('Player1')).toBeTruthy();
    expect(screen.getByText('UNRANKED')).toBeTruthy();
    expect(screen.queryByText('Top 12.30%')).toBeNull();
  });

  it('does not display UNRANKED when elo is 0', () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsState,
      stats: {
        ...defaultUserRankedStatsState.stats,
        elo: 0,
        rank: Rank.STONE,
      } as typeof defaultUserRankedStatsState.stats,
    });

    renderComponent();

    expect(screen.getByText('123')).toBeTruthy();
    expect(screen.getByText('Player1')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.getByText('Top 12.30%')).toBeTruthy();
    expect(screen.queryByText('UNRANKED')).toBeNull();
  });
});
