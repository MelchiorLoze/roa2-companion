import { render, screen } from '@testing-library/react-native';

import { StatRows } from './StatRows';

describe('StatRows', () => {
  it('renders all rows with string values', () => {
    render(
      <StatRows
        rows={[
          { label: 'Rank', value: 'Gold' },
          { label: 'Region', value: 'NA' },
        ]}
      />,
    );

    expect(screen.getByText('Rank')).toBeTruthy();
    expect(screen.getByText('Gold')).toBeTruthy();
    expect(screen.getByText('Region')).toBeTruthy();
    expect(screen.getByText('NA')).toBeTruthy();
  });

  it('renders all rows with number values', () => {
    render(
      <StatRows
        rows={[
          { label: 'Wins', value: 10 },
          { label: 'Losses', value: 3 },
        ]}
      />,
    );

    expect(screen.getByText('Wins')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('Losses')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('renders nothing when rows is empty', () => {
    render(<StatRows rows={[]} />);

    expect(screen.queryByText(/.+/)).toBeNull();
  });

  it('renders a single row', () => {
    render(<StatRows rows={[{ label: 'ELO', value: 1500 }]} />);

    expect(screen.getByText('ELO')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();
  });
});
