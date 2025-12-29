import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { OutlinedText } from '@/components/OutlinedText/OutlinedText';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserRankedStats } from '../../hooks/business/useUserRankedStats/useUserRankedStats';
import { Rank } from '../../types/rank';
import { RankedStats } from './RankedStats';

jest.mock('../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const setPreviousSeasonMock = jest.fn();
const setNextSeasonMock = jest.fn();
const defaultSeasonReturnValue: ReturnType<typeof useSeason> = {
  season: {
    index: 5,
    name: 'Season 5',
    isFirst: false,
    isLast: false,
  },
  leaderboardId: 789,
  isLoading: false,
  setPreviousSeason: setPreviousSeasonMock,
  setNextSeason: setNextSeasonMock,
};

jest.mock('../../hooks/business/useUserRankedStats/useUserRankedStats');
const useUserRankedStatsMock = jest.mocked(useUserRankedStats);
const defaultUserRankedStatsState: ReturnType<typeof useUserRankedStats> = {
  stats: {
    elo: 925,
    rank: Rank.GOLD,
    position: 123,
    playerCount: 1000,
    setStats: { setCount: 100, winCount: 75, winRate: 75 },
    bestWinStreak: 20,
    profile: {
      playerName: 'Player1',
      avatarUrl: new URL('https://www.example.com/icon/player1.png'),
    },
  },
  refresh: jest.fn(),
  isLoading: false,
  isRefreshing: false,
};

jest.mock('../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
useLeaderboardStatsMock.mockReturnValue({
  firstPlayerElo: 1000,
  lastPlayerElo: -1000,
  lastAethereanElo: 1800,
  leaderboardEntries: [],
  isLoading: false,
});

jest.mock('@/components/OutlinedText/OutlinedText');
jest.mocked(OutlinedText).mockImplementation(({ text }) => <Text>{text}</Text>);

const renderComponent = () => {
  render(<RankedStats />);

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useUserRankedStatsMock).toHaveBeenCalledTimes(1);
};

describe('RankedStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonReturnValue);
    useUserRankedStatsMock.mockReturnValue(defaultUserRankedStatsState);
  });

  it('renders correctly', () => {
    renderComponent();

    screen.getByText('Ranked - Season 5');
    screen.getByText('S5');
    expect(screen.getAllByRole('button')).toHaveLength(2); // Previous and Next season buttons

    screen.getByText('123');
    screen.getByText('Player1');
    screen.getByText('925');
    expect(screen.queryByText('UNRANKED')).toBeNull();

    screen.getByText('Ranked wins');
    screen.getByText('75');

    screen.getByText('Ranked losses');
    screen.getByText('25');

    screen.getByText('Ranked win rate');
    screen.getByText('75.00%');

    screen.getByText('Best win streak');
    screen.getByText('20');

    screen.getByText('Top 12.30%');
  });

  it('does not allow to switch to previous session when already at the first', () => {
    useSeasonMock.mockReturnValue({
      ...defaultSeasonReturnValue,
      season: {
        ...defaultSeasonReturnValue.season,
        isFirst: true,
        isLast: false,
      },
    });

    renderComponent();

    const [prevButton, nextButton] = screen.getAllByRole('button');

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeEnabled();
  });

  it('does not allow to switch to next session when already at the last', () => {
    useSeasonMock.mockReturnValue({
      ...defaultSeasonReturnValue,
      season: {
        ...defaultSeasonReturnValue.season,
        isFirst: false,
        isLast: true,
      },
    });

    renderComponent();

    const [prevButton, nextButton] = screen.getAllByRole('button');

    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeDisabled();
  });

  it('allows navigation between seasons', () => {
    renderComponent();

    const [prevButton, nextButton] = screen.getAllByRole('button');

    expect(prevButton).toBeEnabled();
    expect(nextButton).toBeEnabled();

    fireEvent.press(prevButton);
    expect(setPreviousSeasonMock).toHaveBeenCalledTimes(1);

    fireEvent.press(nextButton);
    expect(setNextSeasonMock).toHaveBeenCalledTimes(1);
  });

  it('displays loading spinner when stats are loading', () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });

  it('displays UNRANKED when elo is undefined', () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsState,
      stats: {
        ...defaultUserRankedStatsState.stats,
        elo: undefined,
        rank: undefined,
      } as typeof defaultUserRankedStatsState.stats,
    });

    renderComponent();

    screen.getByText('123');
    screen.getByText('Player1');
    screen.getByText('UNRANKED');
    expect(screen.queryByText('Top 12.30%')).toBeNull();
  });

  it('does not display UNRANKED when elo is 0', () => {
    useUserRankedStatsMock.mockReturnValue({
      ...defaultUserRankedStatsState,
      stats: {
        ...defaultUserRankedStatsState.stats,
        elo: 0,
        rank: Rank.STONE,
      } as typeof defaultUserRankedStatsState.stats,
    });

    renderComponent();

    screen.getByText('123');
    screen.getByText('Player1');
    screen.getByText('0');
    screen.getByText('Top 12.30%');
    expect(screen.queryByText('UNRANKED')).toBeNull();
  });
});
