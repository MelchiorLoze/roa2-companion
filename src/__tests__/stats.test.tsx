import { render, screen, userEvent } from '@testing-library/react-native';

import Stats from '@/app/(private)/stats';
import { useSeason } from '@/features/stats/contexts/SeasonContext/SeasonContext';
import { useLeaderboardStats } from '@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserCrewsStats } from '@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats';
import { useUserDoublesStats } from '@/features/stats/hooks/business/useUserDoublesStats/useUserDoublesStats';
import { useUserGlobalStats } from '@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats';
import { useUserRankedStats } from '@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats';
import { testLeaderboardEntries } from '@/features/stats/test-helpers/testLeaderboardEntries';
import { Rank } from '@/features/stats/types/rank';
import { Character } from '@/types/character';

const user = userEvent.setup();

jest.mock('@/features/stats/contexts/SeasonContext/SeasonContext');
jest.mock('@/features/stats/hooks/business/useUserRankedStats/useUserRankedStats');
jest.mock('@/features/stats/hooks/business/useUserDoublesStats/useUserDoublesStats');
jest.mock('@/features/stats/hooks/business/useUserCrewsStats/useUserCrewsStats');
jest.mock('@/features/stats/hooks/business/useUserGlobalStats/useUserGlobalStats');
jest.mock('@/features/stats/hooks/business/useLeaderboardStats/useLeaderboardStats');

const useSeasonMock = jest.mocked(useSeason);
const useUserRankedStatsMock = jest.mocked(useUserRankedStats);
const useUserDoublesStatsMock = jest.mocked(useUserDoublesStats);
const useUserCrewsStatsMock = jest.mocked(useUserCrewsStats);
const useUserGlobalStatsMock = jest.mocked(useUserGlobalStats);
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);

const defaultSeasonReturnValue: ReturnType<typeof useSeason> = {
  season: {
    index: 1,
    name: 'Season 1',
    isFirst: true,
    isLast: false,
  },
  leaderboardId: 789,
  setPreviousSeason: jest.fn(),
  setNextSeason: jest.fn(),
  isLoading: false,
  isError: false,
};

const defaultUserRankedStatsReturnValue: ReturnType<typeof useUserRankedStats> = {
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
  isError: false,
};

const defaultUserDoublesStatsReturnValue: ReturnType<typeof useUserDoublesStats> = {
  stats: {
    elo: 1500,
    setStats: { setCount: 50 },
    bestWinStreak: 9,
    position: 4404,
    profile: {
      playerName: 'Player1',
      avatarUrl: new URL('https://www.example.com/icon/player1.png'),
    },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
  isError: false,
};

const defaultUserCrewsStatsReturnValue: ReturnType<typeof useUserCrewsStats> = {
  stats: {
    elo: 1500,
    setStats: { setCount: 50 },
    bestWinStreak: 5,
    position: 45,
    profile: { playerName: 'Player1', avatarUrl: new URL('https://www.example.com/avatars/player1.png') },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
  isError: false,
};

const defaultUserGlobalStatsReturnValue: ReturnType<typeof useUserGlobalStats> = {
  stats: {
    gameStats: { gameCount: 500, winCount: 300, winRate: 60 },
    characterStats: [
      { character: Character.KRAGG, gameCount: 20, level: 3 },
      { character: Character.CLAIREN, gameCount: 50, level: 5 },
      { character: Character.OLYMPIA, gameCount: 10, level: 10 },
      { character: Character.RANNO, gameCount: 30, level: 5 },
    ],
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
  isError: false,
};

const defaultLeaderboardStatsReturnValue: ReturnType<typeof useLeaderboardStats> = {
  firstPlayerElo: 2162,
  lastPlayerElo: -100,
  lastAethereanElo: 1837,
  leaderboardEntries: testLeaderboardEntries,
  isLoading: false,
  isError: false,
};

describe('Stats', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('1970-01-01T00:00:00.000Z'));

    useSeasonMock.mockReturnValue(defaultSeasonReturnValue);
    useUserRankedStatsMock.mockReturnValue(defaultUserRankedStatsReturnValue);
    useUserDoublesStatsMock.mockReturnValue(defaultUserDoublesStatsReturnValue);
    useUserCrewsStatsMock.mockReturnValue(defaultUserCrewsStatsReturnValue);
    useUserGlobalStatsMock.mockReturnValue(defaultUserGlobalStatsReturnValue);
    useLeaderboardStatsMock.mockReturnValue(defaultLeaderboardStatsReturnValue);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly on initial tab (ranked)', async () => {
    const { toJSON } = await render(<Stats />);

    expect(screen.getByText('ranked')).toBeDisabled();
    expect(screen.getByText('2v2')).toBeEnabled();
    expect(screen.getByText('crews')).toBeEnabled();
    expect(screen.getByText('global')).toBeEnabled();

    const tree = toJSON();
    // Remove circular references for snapshot testing
    if (tree) {
      const scrollable = tree.children[1];
      if (scrollable && typeof scrollable !== 'string') delete scrollable.props.refreshControl;
    }

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly on 2v2 tab', async () => {
    const { toJSON } = await render(<Stats />);

    const doublesTab = screen.getByText('2v2');
    await user.press(doublesTab);

    expect(screen.getByText('ranked')).toBeEnabled();
    expect(screen.getByText('2v2')).toBeDisabled();
    expect(screen.getByText('crews')).toBeEnabled();
    expect(screen.getByText('global')).toBeEnabled();

    const tree = toJSON();
    // Remove circular references for snapshot testing
    if (tree) {
      const scrollable = tree.children[1];
      if (scrollable && typeof scrollable !== 'string') delete scrollable.props.refreshControl;
    }

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly on crews tab', async () => {
    const { toJSON } = await render(<Stats />);

    const crewsTab = screen.getByText('crews');
    await user.press(crewsTab);

    expect(screen.getByText('ranked')).toBeEnabled();
    expect(screen.getByText('2v2')).toBeEnabled();
    expect(screen.getByText('crews')).toBeDisabled();
    expect(screen.getByText('global')).toBeEnabled();

    const tree = toJSON();
    // Remove circular references for snapshot testing
    if (tree) {
      const scrollable = tree.children[1];
      if (scrollable && typeof scrollable !== 'string') delete scrollable.props.refreshControl;
    }

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly on global tab', async () => {
    const { toJSON } = await render(<Stats />);

    const globalTab = screen.getByText('global');
    await user.press(globalTab);

    expect(screen.getByText('ranked')).toBeEnabled();
    expect(screen.getByText('2v2')).toBeEnabled();
    expect(screen.getByText('crews')).toBeEnabled();
    expect(screen.getByText('global')).toBeDisabled();

    const tree = toJSON();
    // Remove circular references for snapshot testing
    if (tree) {
      const scrollable = tree.children[1];
      if (scrollable && typeof scrollable !== 'string') delete scrollable.props.refreshControl;
    }

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when player is unranked', async () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsReturnValue,
      stats: {
        elo: undefined,
        rank: undefined,
        bestWinStreak: 0,
        position: 12300,
        playerCount: 20000,
        setStats: undefined,
        profile: { playerName: 'Player 2', avatarUrl: new URL('https://www.example.com/avatars/player2.png') },
      },
    });

    await render(<Stats />);

    expect(screen.getByText('UNRANKED')).toBeTruthy();
  });
});
