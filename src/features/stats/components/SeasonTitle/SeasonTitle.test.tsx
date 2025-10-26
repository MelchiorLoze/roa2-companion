import { render, screen } from '@testing-library/react-native';

import { SeasonTitle } from './SeasonTitle';

describe('SeasonTitle', () => {
  it('renders the season title correctly', () => {
    const seasonName = 'Season 5';

    render(<SeasonTitle seasonName={seasonName} variant="ranked" />);

    screen.getByText(seasonName);
  });
});
