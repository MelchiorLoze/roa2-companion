import { render, screen } from '@testing-library/react-native';
import { DateTime, Duration } from 'luxon';

import { useCountdown } from '@/hooks/business/useCountdown/useCountdown';

import { useXpRotationalBonus } from '../../hooks/business/useXpRotationalBonus/useXpRotationalBonus';
import { XpRotationalBonusBanner } from './XpRotationalBonusBanner';

jest.mock('../../hooks/business/useXpRotationalBonus/useXpRotationalBonus');
const useXpRotationalBonusMock = jest.mocked(useXpRotationalBonus);

jest.mock('@/hooks/business/useCountdown/useCountdown');
const useCountdownMock = jest.mocked(useCountdown);

const defaultReturnValue: ReturnType<typeof useXpRotationalBonus> = {
  currentQueue: 'casual',
  expirationDate: DateTime.utc().plus({ minutes: 45, seconds: 30 }),
};

const renderComponent = () => render(<XpRotationalBonusBanner />);

describe('XpRotationalBonusBanner', () => {
  beforeEach(() => {
    useXpRotationalBonusMock.mockReturnValue(defaultReturnValue);
    useCountdownMock.mockReturnValue(Duration.fromObject({ hours: 0, minutes: 45, seconds: 30 }));
  });

  it('renders the current queue name in the bonus label', () => {
    renderComponent();

    expect(screen.getByText('CASUAL — BONUS +50%')).toBeTruthy();
  });

  it('renders the XP unit label', () => {
    renderComponent();

    expect(screen.getByText('XP')).toBeTruthy();
  });

  it('renders the ends in label', () => {
    renderComponent();

    expect(screen.getByText('ENDS IN:')).toBeTruthy();
  });

  it('renders the formatted time', () => {
    renderComponent();

    expect(screen.getByText('45:30')).toBeTruthy();
  });

  it('renders the width placeholder with the widest digit', () => {
    renderComponent();

    expect(screen.getByText(' 45:88')).toBeTruthy();
  });

  it('renders a different queue name', () => {
    useXpRotationalBonusMock.mockReturnValue({
      ...defaultReturnValue,
      currentQueue: '2v2',
    });

    renderComponent();

    expect(screen.getByText('2V2 — BONUS +50%')).toBeTruthy();
  });

  it('formats single-digit minutes and seconds with leading zeros', () => {
    useCountdownMock.mockReturnValue(Duration.fromObject({ hours: 0, minutes: 5, seconds: 9 }));

    renderComponent();

    expect(screen.getByText('05:09')).toBeTruthy();
  });
});
