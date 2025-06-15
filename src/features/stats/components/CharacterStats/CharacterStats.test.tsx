import { render, screen } from '@testing-library/react-native';

import { Character } from '@/types/character';

import { useUserStats } from '../../hooks/business/useUserStats/useUserStats';
import { Rank } from '../../types/rank';
import { CharacterStats } from './CharacterStats';

jest.mock('../../hooks/business/useUserStats/useUserStats');
const useUserStatsMock = jest.mocked(useUserStats);
const defaultUserStatsState: ReturnType<typeof useUserStats> = {
  rankedStats: {
    elo: 925,
    position: 123,
    rank: Rank.GOLD,
    setCount: 100,
    winCount: 75,
    winRate: 75,
  },
  globalStats: {
    gameCount: 500,
    winCount: 300,
    winRate: 60,
  },
  characterStats: [
    { character: Character.KRAGG, gameCount: 20, level: 3 },
    { character: Character.CLAIREN, gameCount: 50, level: 5 },
    { character: Character.OLYMPIA, gameCount: 10, level: 10 },
    { character: Character.RANNO, gameCount: 30, level: 5 },
  ],
  refresh: jest.fn(),
  isLoading: false,
};

const renderComponent = () => {
  render(<CharacterStats />);

  expect(useUserStatsMock).toHaveBeenCalledTimes(1);
};

describe('CharacterStats', () => {
  beforeEach(() => {
    useUserStatsMock.mockReturnValue(defaultUserStatsState);
  });

  it('renders correctly', () => {
    renderComponent();

    screen.getByText('Characters');
    screen.getByText('Level');
    screen.getByText('Games');
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
