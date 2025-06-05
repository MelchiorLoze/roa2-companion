import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { EloDistributionLineChart } from './EloDistributionLineChart';

jest.mock('../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsState = {
  firstPlayerElo: 0,
  lastPlayerElo: 0,
  lastAethereanElo: 0,
  rankDistribution: [],
  eloDistribution: [],
  isLoading: false,
};

const renderComponent = () => {
  render(<EloDistributionLineChart userElo={1000} width={300} />);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);
  expect(useLeaderboardStatsMock).toHaveBeenCalledWith(1000);
};

describe('EloDistributionLineChart', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsState);
  });

  it('does not render when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsState,
      isLoading: true,
    });

    renderComponent();

    expect(screen.queryByTestId('elo-distribution')).toBeNull();
  });

  it('renders the chart when leaderboard stats are available', () => {
    renderComponent();

    screen.getByTestId('elo-distribution');
  });
});
