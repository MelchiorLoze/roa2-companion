import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '../../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { RankDistributionBarChart } from './RankDistributionBarChart';

jest.mock('../../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
const defaultLeaderboardStatsReturnValue: ReturnType<typeof useLeaderboardStats> = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
  isError: false,
};

const renderComponent = () => {
  const result = render(<RankDistributionBarChart width={300} />);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(2);

  return result;
};

describe('RankDistributionBarChart', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsReturnValue);
  });

  it('renders loading state when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsReturnValue,
      firstPlayerElo: undefined,
      lastPlayerElo: undefined,
      lastAethereanElo: undefined,
      leaderboardEntries: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
    expect(screen.queryByTestId('rank-distribution')).toBeNull();
  });

  it('renders the chart when leaderboard stats are available', () => {
    const tree = renderComponent().toJSON();

    expect(screen.getByTestId('rank-distribution')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
