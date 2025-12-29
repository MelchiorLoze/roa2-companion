import { render, screen } from '@testing-library/react-native';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';
import { GlobalStats } from './GlobalStats';

jest.mock('../../hooks/business/useUserGlobalStats/useUserGlobalStats');
const useUserGlobalStatsMock = jest.mocked(useUserGlobalStats);
const defaultUserGlobalStatsValue: ReturnType<typeof useUserGlobalStats> = {
  stats: {
    gameStats: { gameCount: 420, winCount: 358, winRate: 85.238095 },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

const renderComponent = () => {
  render(<GlobalStats />);

  expect(useUserGlobalStatsMock).toHaveBeenCalledTimes(1);
};

describe('GlobalStats', () => {
  beforeEach(() => {
    useUserGlobalStatsMock.mockReturnValue(defaultUserGlobalStatsValue);
  });

  it('renders global stats with correct values', () => {
    renderComponent();

    screen.getByText('Global');

    screen.getByText('Global wins');
    screen.getByText('358');

    screen.getByText('Global losses');
    screen.getByText('62');

    screen.getByText('Global win rate');
    screen.getByText('85.24%');
  });

  it('displays loading spinner when stats are loading', () => {
    useUserGlobalStatsMock.mockReturnValue({
      ...defaultUserGlobalStatsValue,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });
});
