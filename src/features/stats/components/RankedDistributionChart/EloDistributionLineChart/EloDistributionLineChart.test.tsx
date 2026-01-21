import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '../../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { testLeaderboardEntries } from '../../../test-helpers/testLeaderboardEntries';
import { EloDistributionLineChart } from './EloDistributionLineChart';

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
  const result = render(<EloDistributionLineChart userElo={1000} width={300} />);

  expect(useLeaderboardStatsMock).toHaveBeenCalledTimes(1);

  return result;
};

describe('EloDistributionLineChart', () => {
  beforeEach(() => {
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsReturnValue);
  });

  it('does not render when leaderboard stats are loading', () => {
    useLeaderboardStatsMock.mockReturnValue({
      ...defaultLeaderboardStatsReturnValue,
      firstPlayerElo: undefined,
      lastPlayerElo: undefined,
      lastAethereanElo: undefined,
      leaderboardEntries: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.queryByTestId('elo-distribution')).toBeNull();
  });

  it('renders the chart when leaderboard stats are available', () => {
    const tree = renderComponent().toJSON();

    expect(screen.getByTestId('elo-distribution')).toBeTruthy();
    expect(tree).toMatchSnapshot();
  });
});
