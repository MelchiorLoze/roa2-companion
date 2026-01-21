import { render, screen } from '@testing-library/react-native';

import { Character } from '@/types/character';

import { useUserGlobalStats } from '../../hooks/business/useUserGlobalStats/useUserGlobalStats';
import { GlobalStats } from './GlobalStats';

jest.mock('../../hooks/business/useUserGlobalStats/useUserGlobalStats');
const useUserGlobalStatsMock = jest.mocked(useUserGlobalStats);
const defaultUserGlobalStatsReturnValue: ReturnType<typeof useUserGlobalStats> = {
  stats: {
    gameStats: { gameCount: 420, winCount: 358, winRate: 85.238095 },
    characterStats: [
      { character: Character.KRAGG, gameCount: 100, level: 5 },
      { character: Character.CLAIREN, gameCount: 50, level: 3 },
    ],
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
  isError: false,
};

const renderComponent = () => {
  render(<GlobalStats />);

  expect(useUserGlobalStatsMock).toHaveBeenCalledTimes(1);
};

describe('GlobalStats', () => {
  beforeEach(() => {
    useUserGlobalStatsMock.mockReturnValue(defaultUserGlobalStatsReturnValue);
  });

  it('renders global stats with correct values', () => {
    renderComponent();

    expect(screen.getByText('Global wins')).toBeTruthy();
    expect(screen.getByText('358')).toBeTruthy();

    expect(screen.getByText('Global losses')).toBeTruthy();
    expect(screen.getByText('62')).toBeTruthy();

    expect(screen.getByText('Global win rate')).toBeTruthy();
    expect(screen.getByText('85.24%')).toBeTruthy();

    expect(screen.getByText('Level')).toBeTruthy();
    expect(screen.getByText('Games')).toBeTruthy();
  });

  it('displays loading spinner when stats are loading', () => {
    useUserGlobalStatsMock.mockReturnValue({
      ...defaultUserGlobalStatsReturnValue,
      stats: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('spinner')).toBeTruthy();
  });
});
