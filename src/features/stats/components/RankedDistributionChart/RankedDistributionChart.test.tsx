import { render, screen } from '@testing-library/react-native';

import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { Rank } from '../../types/rank';
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
    render(<RankedDistributionChart elo={925} position={123} rank={Rank.GOLD} />);

    screen.getByText('925 - #123');
    screen.getByTestId('rank-distribution');
    screen.getByTestId('elo-distribution');
  });
});
