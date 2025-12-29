import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { RankedDistributionChart } from './RankedDistributionChart';

jest.mock('../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
useLeaderboardStatsMock.mockReturnValue({
  firstPlayerElo: 1000,
  lastPlayerElo: -100,
  lastAethereanElo: 1800,
  leaderboardEntries: [],
  isLoading: false,
});

describe('RankedDistributionChart', () => {
  it('renders correctly with given props', () => {
    render(<RankedDistributionChart elo={925} />);

    expect(screen.getByTestId('rank-distribution')).toBeTruthy();
    expect(screen.getByTestId('elo-distribution')).toBeTruthy();
  });
});
