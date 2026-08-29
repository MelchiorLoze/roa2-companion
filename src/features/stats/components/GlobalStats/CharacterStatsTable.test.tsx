import { render, screen } from '@testing-library/react-native';

import { Character } from '@/types/character';

import { CharacterStatsTable } from './CharacterStatsTable';

const defaultCharacterStats = [
  { character: Character.KRAGG, gameCount: 100, level: 5 },
  { character: Character.CLAIREN, gameCount: 50, level: 3 },
  { character: Character.ZETTERBURN, gameCount: 200, level: 5 },
  { character: Character.ETALUS, gameCount: 3, level: 4 },
];

const renderComponent = (characterStats = defaultCharacterStats) => {
  render(<CharacterStatsTable characterStats={characterStats} />);
};

describe('CharacterStatsTable', () => {
  it('renders header labels', () => {
    renderComponent();

    expect(screen.getByText('Level')).toBeTruthy();
    expect(screen.getByText('Games')).toBeTruthy();
  });

  it('renders character stats values', () => {
    renderComponent();

    expect(screen.getAllByText('5')).toHaveLength(2);
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('200')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getAllByText('3')).toHaveLength(2);
    expect(screen.getByText('50')).toBeTruthy();
  });

  it('sorts by level descending then by game count descending', () => {
    renderComponent();

    const allTexts = screen.getAllByText(/^\d+$/).map((el) => el.props.children as number);

    // ZETTERBURN (level 5, 200 games) before KRAGG (level 5, 100 games) before ETALUS (level 4, 3 games) before CLAIREN (level 3, 50 games)
    expect(allTexts).toEqual([5, 200, 5, 100, 4, 3, 3, 50]);
  });

  it('renders an empty table when there are no character stats', () => {
    renderComponent([]);

    expect(screen.getByText('Level')).toBeTruthy();
    expect(screen.getByText('Games')).toBeTruthy();
    expect(screen.queryAllByText(/^\d+$/)).toHaveLength(0);
  });
});
