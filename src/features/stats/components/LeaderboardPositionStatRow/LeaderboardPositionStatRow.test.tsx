import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { OutlinedText } from '@/components/OutlinedText/OutlinedText';

import { CrewsIcon } from '../../assets/images/crews';
import { Rank } from '../../types/rank';
import { LeaderboardPositionRow } from './LeaderboardPositionStatRow';

jest.mock('@/components/OutlinedText/OutlinedText');
jest.mocked(OutlinedText).mockImplementation(({ text }) => <Text>{text}</Text>);

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

    screen.getByText('123');
    screen.getByText('Test Player');
    screen.getByText('1200');
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

    screen.getByText('1');
    screen.getByText('Test Player');
    screen.getByText('UNRANKED');
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

    screen.getByText('1');
    screen.getByText('Test Player');
    screen.getByText('1500');
    expect(screen.queryByText('UNRANKED')).toBeNull();
  });
});
