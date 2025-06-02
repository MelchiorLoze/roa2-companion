import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '@/hooks/business/useLeaderboardStats/useLeaderboardStats';

import { RankDistributionBarChart } from './RankDistributionBarChart';

jest.mock('@/hooks/business/useLeaderboardStats/useLeaderboardStats');
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
  render(<RankDistributionBarChart width={300} />);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);
};

describe('RankDistributionBarChart', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsState);
  });

  it('renders loading state when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByA11yHint('Loading...');
    expect(screen.queryByTestId('rank-distribution')).toBeNull();
  });

  it('renders the chart when leaderboard stats are available', () => {
    renderComponent();

    screen.getByTestId('rank-distribution');
  });
});
