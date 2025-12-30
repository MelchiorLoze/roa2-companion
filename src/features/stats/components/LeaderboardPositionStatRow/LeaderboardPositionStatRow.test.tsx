import { render, screen } from '@testing-library/react-native';

import { CrewsIcon } from '../../assets/images/crews';
import { Rank } from '../../types/rank';
import { LeaderboardPositionRow } from './LeaderboardPositionStatRow';

describe('LeaderboardPositionStatRow', () => {
  it('renders correctly', () => {
    render(
      <LeaderboardPositionRow
        avatarUrl={new URL('https://example.com/avatar.png')}
        elo={1200}
        playerName="Test Player"
        position={123}
        rank={Rank.GOLD}
      />,
    );

    expect(screen.getByText('123')).toBeTruthy();
    expect(screen.getByText('Test Player')).toBeTruthy();
    expect(screen.getByText('1200')).toBeTruthy();
    expect(screen.queryByText('UNRANKED')).toBeNull();
  });

  it('renders correctly without rank and elo', () => {
    render(
      <LeaderboardPositionRow
        avatarUrl={new URL('https://example.com/avatar.png')}
        playerName="Test Player"
        position={1}
      />,
    );

    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('Test Player')).toBeTruthy();
    expect(screen.getByText('UNRANKED')).toBeTruthy();
  });

  it('renders correctly without rank if the rankIcon is provided', () => {
    render(
      <LeaderboardPositionRow
        avatarUrl={new URL('https://example.com/avatar.png')}
        elo={1500}
        playerName="Test Player"
        position={1}
        rankIcon={CrewsIcon}
      />,
    );

    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('Test Player')).toBeTruthy();
    expect(screen.getByText('1500')).toBeTruthy();
    expect(screen.queryByText('UNRANKED')).toBeNull();
  });
});
