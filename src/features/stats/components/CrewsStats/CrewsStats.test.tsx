import { render, screen } from '@testing-library/react-native';

import { useUserCrewsStats } from '../../hooks/business/useUserCrewsStats/useUserCrewsStats';
import { CrewsStats } from './CrewsStats';

jest.mock('../../hooks/business/useUserCrewsStats/useUserCrewsStats');
const useUserCrewsStatsMock = jest.mocked(useUserCrewsStats);
const defaultUserCrewsStatsState: ReturnType<typeof useUserCrewsStats> = {
  stats: {
    elo: 1500,
    setStats: { setCount: 50 },
    position: 4404,
    profile: {
      playerName: 'Player1',
      avatarUrl: new URL('https://www.example.com/icon/player1.png'),
    },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

const renderComponent = () => {
  render(<CrewsStats />);

  expect(useUserCrewsStatsMock).toHaveBeenCalledTimes(1);
};

describe('CrewsStats', () => {
  beforeEach(() => {
    useUserCrewsStatsMock.mockReturnValue(defaultUserCrewsStatsState);
  });

  it('renders crews stats with correct values', () => {
    renderComponent();

    screen.getByText('4404');
    screen.getByText('Player1');
    screen.getByText('1500');

    screen.getByText('Crews sets');
    screen.getByText('50');
  });

  it('displays loading spinner when stats are loading', () => {
    useUserCrewsStatsMock.mockReturnValue({
      ...defaultUserCrewsStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });

  it('displays loading spinner when stats are undefined', () => {
    useUserCrewsStatsMock.mockReturnValue({
      ...defaultUserCrewsStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });
});
