import { render, screen } from '@testing-library/react-native';

import { useUserStats } from '../../hooks/business/useUserStats/useUserStats';
import { Rank } from '../../types/rank';
import { GlobalStats } from './GlobalStats';

jest.mock('../../hooks/business/useUserStats/useUserStats');
const useUserStatsMock = jest.mocked(useUserStats);
const defaultUserStatsState: ReturnType<typeof useUserStats> = {
  rankedStats: {
    elo: 100,
    position: 100,
    rank: Rank.STONE,
    setStats: { setCount: 100, winCount: 100, winRate: 100 },
  },
  globalStats: {
    gameStats: { gameCount: 420, winCount: 358, winRate: 85.238095 },
  },
  characterStats: [],
  refresh: jest.fn(),
  isLoading: false,
};

const renderComponent = () => {
  render(<GlobalStats />);

  expect(useUserStatsMock).toHaveBeenCalledTimes(1);
};

describe('GlobalStats', () => {
  beforeEach(() => {
    useUserStatsMock.mockReturnValue(defaultUserStatsState);
  });

  it('renders global stats with correct values', () => {
    renderComponent();

    screen.getByText('Global');
    screen.getByText('420 games: 358 W - 62 L');
    screen.getByText('Winrate: 85.24%');
  });

  it('displays loading spinner when stats are loading', () => {
    useUserStatsMock.mockReturnValue({
      ...defaultUserStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });
});
