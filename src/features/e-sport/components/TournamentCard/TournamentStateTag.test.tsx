import { render, screen } from '@testing-library/react-native';

import { TournamentState } from '../../types/tournament';
import { TournamentStateTag } from './TournamentStateTag';

const renderComponent = (tournamentState: TournamentState, pressed = false) => {
  return render(<TournamentStateTag pressed={pressed} tournamentState={tournamentState} />);
};

describe('TournamentStateTag', () => {
  it('renders UPCOMING state correctly', () => {
    renderComponent(TournamentState.UPCOMING);

    screen.getByText('UPCOMING');
  });

  it('renders ONGOING state correctly', () => {
    renderComponent(TournamentState.ONGOING);

    screen.getByText('ONGOING');
  });

  it('renders COMPLETED state correctly', () => {
    renderComponent(TournamentState.COMPLETED);

    screen.getByText('COMPLETED');
  });

  it('renders correctly when pressed', () => {
    renderComponent(TournamentState.ONGOING, true);

    screen.getByText('ONGOING');
  });

  it('matches snapshot for UPCOMING state', () => {
    const tree = renderComponent(TournamentState.UPCOMING).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for ONGOING state', () => {
    const tree = renderComponent(TournamentState.ONGOING).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot for COMPLETED state', () => {
    const tree = renderComponent(TournamentState.COMPLETED).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot when pressed', () => {
    const tree = renderComponent(TournamentState.ONGOING, true).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
