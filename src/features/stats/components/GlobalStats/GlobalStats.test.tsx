import { render, screen } from '@testing-library/react-native';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';
import { GlobalStats } from './GlobalStats';

jest.mock('../../hooks/business/useUserGlobalStats/useUserGlobalStats');
const useUserGlobalStatsMock = jest.mocked(useUserGlobalStats);
const defaultUserGlobalStatsState: ReturnType<typeof useUserGlobalStats> = {
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
    useUserGlobalStatsMock.mockReturnValue(defaultUserGlobalStatsState);
  });

  it('renders global stats with correct values', () => {
    renderComponent();

    screen.getByText('Global');
    screen.getByText('420 games');
    screen.getByText('358 W - 62 L');
    screen.getByText('Winrate: 85.24%');
  });

  it('displays loading spinner when stats are loading', () => {
    useUserGlobalStatsMock.mockReturnValue({
      ...defaultUserGlobalStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });
});
