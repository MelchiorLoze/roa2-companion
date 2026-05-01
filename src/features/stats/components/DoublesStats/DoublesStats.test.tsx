import { render, screen } from '@testing-library/react-native';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserDoublesStats } from '../../hooks/business/useUserDoublesStats/useUserDoublesStats';
import { DoublesStats } from './DoublesStats';

jest.mock('../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const defaultSeasonReturnValue: ReturnType<typeof useSeason> = {
  season: {
    index: 5,
    name: 'Season 5',
    isFirst: false,
    isLast: false,
  },
  leaderboardId: 789,
  setPreviousSeason: jest.fn(),
  setNextSeason: jest.fn(),
  isLoading: false,
  isError: false,
};

jest.mock('../../hooks/business/useUserDoublesStats/useUserDoublesStats');
const useUserDoublesStatsMock = jest.mocked(useUserDoublesStats);
const defaultUserDoublesStatsReturnValue: ReturnType<typeof useUserDoublesStats> = {
  stats: {
    elo: 1500,
    setStats: { setCount: 50 },
    bestWinStreak: 9,
    position: 4404,
    profile: {
      playerName: 'Player1',
      avatarUrl: new URL('https://www.example.com/icon/player1.png'),
    },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
  isError: false,
};

const renderComponent = () => {
  render(<DoublesStats />);

  expect(useUserDoublesStatsMock).toHaveBeenCalledTimes(1);
};

describe('DoublesStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonReturnValue);
    useUserDoublesStatsMock.mockReturnValue(defaultUserDoublesStatsReturnValue);
  });

  it('renders doubles stats with correct values', () => {
    renderComponent();

    expect(screen.getByText('Season 5')).toBeTruthy();

    expect(screen.getByText('4404')).toBeTruthy();
    expect(screen.getByText('Player1')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();

    expect(screen.getByText('2v2 sets')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
    expect(screen.getByText('Best win streak')).toBeTruthy();
    expect(screen.getByText('9')).toBeTruthy();
  });

  it('displays loading spinner when stats are loading', () => {
    useUserDoublesStatsMock.mockReturnValue({
      ...defaultUserDoublesStatsReturnValue,
      stats: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('displays loading spinner when stats are undefined', () => {
    useUserDoublesStatsMock.mockReturnValue({
      ...defaultUserDoublesStatsReturnValue,
      stats: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });
});
