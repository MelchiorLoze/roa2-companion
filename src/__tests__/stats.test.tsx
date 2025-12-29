import { render } from '@testing-library/react-native';

import Stats from '@/app/(private)/stats';
import { useSeason } from '@/features/stats/contexts/SeasonContext/SeasonContext';
import { useLeaderboardStats } from '@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserCharacterStats } from '@/features/stats/hooks/business/useUserCharacterStats/useUserCharacterStats';
import { useUserCrewsStats } from '@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats';
import { useUserGlobalStats } from '@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats';
import { useUserRankedStats } from '@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats';
import { testLeaderboardEntries } from '@/features/stats/test-helpers/testLeaderboardEntries';
import { Rank } from '@/features/stats/types/rank';
import { Character } from '@/types/character';

jest.mock('@/features/stats/contexts/SeasonContext/SeasonContext');
jest.mock('@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats');
jest.mock('@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats');
jest.mock('@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats');
jest.mock('@/features/stats/hooks/business/useUserCharacterStats/useUserCharacterStats');
jest.mock('@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats');

const useSeasonMock = jest.mocked(useSeason);
const useUserRankedStatsMock = jest.mocked(useUserRankedStats);
const useUserCrewsStatsMock = jest.mocked(useUserCrewsStats);
const useUserGlobalStatsMock = jest.mocked(useUserGlobalStats);
const useUserCharacterStatsMock = jest.mocked(useUserCharacterStats);
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);

const defaultSeasonValue: ReturnType<typeof useSeason> = {
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
};

const defaultUserRankedStatsValue: ReturnType<typeof useUserRankedStats> = {
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
};

const defaultUserCrewsStatsValue: ReturnType<typeof useUserCrewsStats> = {
  stats: {
    elo: 1500,
    setStats: { setCount: 50 },
    position: 45,
    profile: { playerName: 'Player1', avatarUrl: new URL('https://www.example.com/avatars/player1.png') },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

const defaultUserGlobalStatsValue: ReturnType<typeof useUserGlobalStats> = {
  stats: {
    gameStats: { gameCount: 500, winCount: 300, winRate: 60 },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

const defaultUserCharacterStatsValue: ReturnType<typeof useUserCharacterStats> = {
  stats: [
    { character: Character.KRAGG, gameCount: 20, level: 3 },
    { character: Character.CLAIREN, gameCount: 50, level: 5 },
    { character: Character.OLYMPIA, gameCount: 10, level: 10 },
    { character: Character.RANNO, gameCount: 30, level: 5 },
  ],
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

const defaultLeaderboardStatsValue: ReturnType<typeof useLeaderboardStats> = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
};

describe('Stats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonValue);
    useUserRankedStatsMock.mockReturnValue(defaultUserRankedStatsValue);
    useUserCrewsStatsMock.mockReturnValue(defaultUserCrewsStatsValue);
    useUserGlobalStatsMock.mockReturnValue(defaultUserGlobalStatsValue);
    useUserCharacterStatsMock.mockReturnValue(defaultUserCharacterStatsValue);
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsValue);
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<Stats />);
    const tree = toJSON();

    // Remove circular references for snapshot testing
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete tree.props.refreshControl;

    expect(tree).toMatchSnapshot();
  });
});
