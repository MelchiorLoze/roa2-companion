import { render, screen } from '@testing-library/react-native';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';
import { CrewsStats } from './CrewsStats';

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
  isLoading: false,
  setPreviousSeason: jest.fn(),
  setNextSeason: jest.fn(),
};

jest.mock('../../hooks/business/useUserCrewsStats/useUserCrewsStats');
const useUserCrewsStatsMock = jest.mocked(useUserCrewsStats);
const defaultUserCrewsStatsReturnValue: ReturnType<typeof useUserCrewsStats> = {
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
  render(<CrewsStats />);

  expect(useUserCrewsStatsMock).toHaveBeenCalledTimes(1);
};

describe('CrewsStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonReturnValue);
    useUserCrewsStatsMock.mockReturnValue(defaultUserCrewsStatsReturnValue);
  });

  it('renders crews stats with correct values', () => {
    renderComponent();

    expect(screen.getByText('Season 5')).toBeTruthy();

    expect(screen.getByText('4404')).toBeTruthy();
    expect(screen.getByText('Player1')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();

    expect(screen.getByText('Crews sets')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
    expect(screen.getByText('Best win streak')).toBeTruthy();
    expect(screen.getByText('9')).toBeTruthy();
  });

  it('displays loading spinner when stats are loading', () => {
    useUserCrewsStatsMock.mockReturnValue({
      ...defaultUserCrewsStatsReturnValue,
      stats: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });

  it('displays loading spinner when stats are undefined', () => {
    useUserCrewsStatsMock.mockReturnValue({
      ...defaultUserCrewsStatsReturnValue,
      stats: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });
});
