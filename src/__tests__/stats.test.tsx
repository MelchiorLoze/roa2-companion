import { render } from '@testing-library/react-native';

import Stats from '@/app/(private)/stats';
import { useLeaderboardStats } from '@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserCharacterStats } from '@/features/stats/hooks/business/useUserCharacterStats/useUserCharacterStats';
import { useUserCrewsStats } from '@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats';
import { useUserGlobalStats } from '@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats';
import { useUserRankedStats } from '@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats';
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

jest.mock('@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats');
const useUserRankedStatsMock = jest.mocked(useUserRankedStats);
useUserRankedStatsMock.mockReturnValue({
  stats: {
    elo: 925,
    rank: Rank.GOLD,
    bestWinStreak: 15,
    position: 123,
    playerCount: 1000,
    setStats: { setCount: 100, winCount: 75, winRate: 75 },
    profile: { playerName: 'TestPlayer', avatarUrl: new URL('https://www.example.com/avatars/testplayer.png') },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
});

jest.mock('@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats');
const useUserCrewsStatsMock = jest.mocked(useUserCrewsStats);
useUserCrewsStatsMock.mockReturnValue({
  stats: {
    elo: 1500,
    setStats: { setCount: 50 },
    position: 45,
    profile: { playerName: 'Player1', avatarUrl: new URL('https://www.example.com/avatars/player1.png') },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
});

jest.mock('@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats');
const useUserGlobalStatsMock = jest.mocked(useUserGlobalStats);
useUserGlobalStatsMock.mockReturnValue({
  stats: {
    gameStats: { gameCount: 500, winCount: 300, winRate: 60 },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
});

jest.mock('@/features/stats/hooks/business/useUserCharacterStats/useUserCharacterStats');
const useUserCharacterStatsMock = jest.mocked(useUserCharacterStats);
useUserCharacterStatsMock.mockReturnValue({
  stats: [
    { character: Character.KRAGG, gameCount: 20, level: 3 },
    { character: Character.CLAIREN, gameCount: 50, level: 5 },
    { character: Character.OLYMPIA, gameCount: 10, level: 10 },
    { character: Character.RANNO, gameCount: 30, level: 5 },
  ],
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
});

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
  it('matches the snapshot', () => {
    const tree = render(<Stats />).toJSON();

    // Remove circular references for snapshot testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete tree.props.refreshControl;

    expect(tree).toMatchSnapshot();
  });
});
