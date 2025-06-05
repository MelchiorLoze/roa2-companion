import { render, screen } from '@testing-library/react-native';

import Stats from '@/app/(private)/stats';
import { useLeaderboardStats } from '@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserStats } from '@/features/stats/hooks/business/useUserStats/useUserStats';
import { Character } from '@/types/character';
import { Rank } from '@/types/rank';

jest.mock('@/features/stats/hooks/business/useUserStats/useUserStats');
const useUserStatsMock = jest.mocked(useUserStats);
const defaultUserStatsState: ReturnType<typeof useUserStats> = {
  stats: {
    rankedPosition: 123,
    rank: Rank.GOLD,
    rankedElo: 925,
    rankedSetCount: 100,
    rankedWinCount: 75,
    rankedWinRate: 75,

    globalMatchCount: 500,
    globalWinCount: 300,
    globalWinRate: 60,

    characterStats: [
      { character: Character.KRAGG, gameCount: 20, level: 3 },
      { character: Character.CLAIREN, gameCount: 50, level: 5 },
      { character: Character.OLYMPIA, gameCount: 10, level: 10 },
      { character: Character.RANNO, gameCount: 30, level: 5 },
    ],
  },
  refresh: jest.fn(),
  isLoading: false,
};

jest.mock('@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
useLeaderboardStatsMock.mockReturnValue({
  firstPlayerElo: 1000,
  lastPlayerElo: -1000,
  lastAethereanElo: 1800,
  rankDistribution: [],
  eloDistribution: [],
  isLoading: false,
});

const renderComponent = () => {
  const result = render(<Stats />);

  expect(useUserStatsMock).toHaveBeenCalledTimes(1);

  return result;
};

describe('Stats', () => {
  beforeEach(() => {
    useUserStatsMock.mockReturnValue(defaultUserStatsState);
  });

  it('matches the snapshot', () => {
    const tree = renderComponent().toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('displays a spinner when the stats items are loading', () => {
    useUserStatsMock.mockReturnValue({
      ...defaultUserStatsState,
      stats: undefined,
      isLoading: true,
    });

    renderComponent();

    screen.getByAccessibilityHint('Loading...');
  });
});
