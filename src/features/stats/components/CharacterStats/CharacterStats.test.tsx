import { render, screen } from '@testing-library/react-native';

import { Character } from '@/types/character';

import { useUserCharacterStats } from '../../hooks/business/useUserCharacterStats/useUserCharacterStats';
import { CharacterStats } from './CharacterStats';

jest.mock('../../hooks/business/useUserCharacterStats/useUserCharacterStats');
const useUserCharacterStatsMock = jest.mocked(useUserCharacterStats);
const defaultUserCharacterStatsReturnValue: ReturnType<typeof useUserCharacterStats> = {
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

const renderComponent = () => {
  render(<CharacterStats />);

  expect(useUserCharacterStatsMock).toHaveBeenCalledTimes(1);
};

describe('CharacterStats', () => {
  beforeEach(() => {
    useUserCharacterStatsMock.mockReturnValue(defaultUserCharacterStatsReturnValue);
  });

  it('renders correctly', () => {
    renderComponent();

    screen.getByText('Characters');
    screen.getByText('Level');
    screen.getByText('Games');
  });

  it('displays loading spinner when stats are loading', () => {
    useUserCharacterStatsMock.mockReturnValue({
      ...defaultUserCharacterStatsReturnValue,
      isLoading: true,
    });

    renderComponent();

    screen.getByTestId('spinner');
  });
});
