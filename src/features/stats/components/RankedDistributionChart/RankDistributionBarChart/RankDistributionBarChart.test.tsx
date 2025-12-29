import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '../../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { RankDistributionBarChart } from './RankDistributionBarChart';

jest.mock('../../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsValue = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
};

const renderComponent = () => {
  const result = render(<RankDistributionBarChart width={300} />);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(2);

  return result;
};

describe('RankDistributionBarChart', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsValue);
  });

  it('renders loading state when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsValue,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
    expect(screen.queryByTestId('rank-distribution')).toBeNull();
  });

  it('renders the chart when leaderboard stats are available', () => {
    const tree = renderComponent();

    screen.getByTestId('rank-distribution');
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
