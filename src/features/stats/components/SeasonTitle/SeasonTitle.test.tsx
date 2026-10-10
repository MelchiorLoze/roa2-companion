import { render, screen } from '@testing-library/react-native';

import { SeasonTitle } from './SeasonTitle';

describe('SeasonTitle', () => {
  it('renders the season title correctly', async () => {
    const seasonName = 'Season 5';

    await render(<SeasonTitle seasonName={seasonName} />);

    expect(screen.getByText(seasonName)).toBeTruthy();
  });
});
