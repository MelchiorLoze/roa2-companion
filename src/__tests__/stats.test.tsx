import { render } from '@testing-library/react-native';

import Stats from '@/app/(private)/stats';
import { useLeaderboardStats } from '@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserStats } from '@/features/stats/hooks/business/useUserStats/useUserStats';
import { testLeaderboardEntries } from '@/features/stats/test-helpers/testLeaderboardEntries';
import { Rank } from '@/features/stats/types/rank';
import { Character } from '@/types/character';

jest.mock('@/features/stats/contexts/SeasonContext/SeasonContext', () => ({
  useSeason: jest.fn().mockReturnValue({
    season: {
      index: 1,
      name: 'Season 1',
      isFirst: true,
      isLast: false,
    },
    leaderboardId: 789,
    isLoading: false,
    setPreviousSeason: jest.fn(),
    setNextSeason: jest.fn(),
  }),
}));

jest.mock('@/features/stats/hooks/business/useUserStats/useUserStats');
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

jest.mock('@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
useLeaderboardStatsMock.mockReturnValue({
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
});

describe('Stats', () => {
  beforeEach(() => {
    useUserStatsMock.mockReturnValue(defaultUserStatsState);
  });

  it('matches the snapshot', () => {
    const tree = render(<Stats />).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
