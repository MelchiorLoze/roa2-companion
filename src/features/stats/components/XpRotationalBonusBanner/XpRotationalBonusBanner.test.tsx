import { act, render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { useXpRotationalBonus } from '../../hooks/business/useXpRotationalBonus/useXpRotationalBonus';
import { XpRotationalBonusBanner } from './XpRotationalBonusBanner';

jest.mock('../../hooks/business/useXpRotationalBonus/useXpRotationalBonus');
const useXpRotationalBonusMock = jest.mocked(useXpRotationalBonus);

const defaultReturnValue: ReturnType<typeof useXpRotationalBonus> = {
  currentQueue: 'casual',
  expirationDate: DateTime.utc(),
};

const renderComponent = () => render(<XpRotationalBonusBanner />);

describe('XpRotationalBonusBanner', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-24T10:00:00Z'));
    defaultReturnValue.expirationDate = DateTime.utc().plus({ minutes: 45, seconds: 30 });
    useXpRotationalBonusMock.mockReturnValue(defaultReturnValue);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('CASUAL — BONUS +50%')).toBeTruthy();
    expect(screen.getByText('XP')).toBeTruthy();

    expect(screen.getByText('ENDS IN:')).toBeTruthy();
    expect(screen.getByText('45:30')).toBeTruthy();
    expect(screen.getByText(' 45:88')).toBeTruthy(); // placeholder
  });

  it('renders a different queue name', () => {
    useXpRotationalBonusMock.mockReturnValue({
      ...defaultReturnValue,
      currentQueue: '2v2',
    });

    renderComponent();

    expect(screen.getByText('2V2 — BONUS +50%')).toBeTruthy();
  });

  it('updates the formatted time as the countdown ticks', () => {
    renderComponent();

    expect(screen.getByText('45:30')).toBeTruthy();

    act(() => jest.advanceTimersByTime(1000));

    expect(screen.getByText('45:29')).toBeTruthy();
  });

  it('formats single-digit minutes and seconds with leading zeros', () => {
    useXpRotationalBonusMock.mockReturnValue({
      ...defaultReturnValue,
      expirationDate: DateTime.utc().plus({ minutes: 5, seconds: 9 }),
    });

    renderComponent();

    expect(screen.getByText('05:09')).toBeTruthy();
  });

  it('handles durations above one hour correctly', () => {
    useXpRotationalBonusMock.mockReturnValue({
      ...defaultReturnValue,
      expirationDate: DateTime.utc().plus({ hours: 1, minutes: 22, seconds: 3 }),
    });

    renderComponent();

    expect(screen.getByText('82:03')).toBeTruthy();
  });
});
