import { fireEvent, render, screen } from '@testing-library/react-native';

import { Character } from '@/types/character';

import { useSeason } from '../../contexts/SeasonContext/SeasonContext';
import { useLeaderboardStats } from '../../hooks/business/useLeaderboardStats/useLeaderboardStats';
import { useUserStats } from '../../hooks/business/useUserStats/useUserStats';
import { Rank } from '../../types/rank';
import { RankedStats } from './RankedStats';

jest.mock('../../contexts/SeasonContext/SeasonContext');
const useSeasonMock = jest.mocked(useSeason);
const setPreviousSeasonMock = jest.fn();
const setNextSeasonMock = jest.fn();
const defaultSeasonState: ReturnType<typeof useSeason> = {
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

jest.mock('../../hooks/business/useUserStats/useUserStats');
const useUserStatsMock = jest.mocked(useUserStats);
const defaultUserStatsState: ReturnType<typeof useUserStats> = {
  rankedStats: {
    elo: 925,
    position: 123,
    rank: Rank.GOLD,
    setStats: { setCount: 100, winCount: 75, winRate: 75 },
  },
  globalStats: {
    gameStats: { gameCount: 500, winCount: 300, winRate: 60 },
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

jest.mock('../../hooks/business/useLeaderboardStats/useLeaderboardStats');
const useLeaderboardStatsMock = jest.mocked(useLeaderboardStats);
useLeaderboardStatsMock.mockReturnValue({
  firstPlayerElo: 1000,
  lastPlayerElo: -1000,
  lastAethereanElo: 1800,
  leaderboardEntries: [],
  isLoading: false,
});

const renderComponent = () => {
  render(<RankedStats />);

  expect(useSeasonMock).toHaveBeenCalledTimes(1);
  expect(useUserStatsMock).toHaveBeenCalledTimes(1);
};

describe('RankedStats', () => {
  beforeEach(() => {
    useSeasonMock.mockReturnValue(defaultSeasonState);
    useUserStatsMock.mockReturnValue(defaultUserStatsState);
  });

  it('renders correctly', () => {
    renderComponent();

    screen.getByText('Ranked - Season 5');
    screen.getByText('S5');
    expect(screen.getAllByRole('button')).toHaveLength(2); // Previous and Next season buttons

    screen.getByText('100 sets: 75 W - 25 L');
    screen.getByText('Winrate: 75.00%');

    screen.getByText('925 - #123');
  });

  it('does not allow to switch to previous session when already at the first', () => {
    useSeasonMock.mockReturnValue({
      ...defaultSeasonState,
      season: {
        ...defaultSeasonState.season,
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
      ...defaultSeasonState,
      season: {
        ...defaultSeasonState.season,
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
    useUserStatsMock.mockReturnValue({
      ...defaultUserStatsState,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });
});
