import { act, render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';
import { type StyleProp, type TextStyle } from 'react-native';

import { TimeCountdown } from './TimeCountdown';

const renderComponent = (date: DateTime, style?: StyleProp<TextStyle>) => {
  return render(<TimeCountdown date={date} style={style} />);
};

describe('TimeCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-24T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial countdown correctly for future date', () => {
    const futureDate = DateTime.utc().plus({ hours: 2, minutes: 30, seconds: 45 });

    renderComponent(futureDate);

    screen.getByText('02h 30m 45s');
  });

  it('renders countdown with zero hours correctly', () => {
    const futureDate = DateTime.utc().plus({ minutes: 45, seconds: 20 });

    renderComponent(futureDate);

    screen.getByText('00h 45m 20s');
  });

  it('renders consistent width placeholder', () => {
    const futureDate = DateTime.utc().plus({ hours: 1, minutes: 30, seconds: 45 });

    renderComponent(futureDate);

    // Should have both the actual countdown and width placeholder
    screen.getByText('01h 30m 45s');
    screen.getByText('01h 30m 88s');
  });

  it('handles large time differences correctly', () => {
    const farFutureDate = DateTime.utc().plus({ hours: 25, minutes: 30, seconds: 45 });

    renderComponent(farFutureDate);

    screen.getByText('25h 30m 45s');
  });

  it('cleans up interval on unmount', () => {
    const futureDate = DateTime.utc().plus({ hours: 1 });
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = renderComponent(futureDate);

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });

  it('updates countdown correctly when time advances', () => {
    const futureDate = DateTime.utc().plus({ minutes: 5, seconds: 10 });

    renderComponent(futureDate);

    // Initial state
    expect(screen.getByText('00h 05m 10s')).toBeTruthy();

    // Advance time by 5 seconds
    act(() => jest.advanceTimersByTime(5000));

    // Should show updated countdown
    expect(screen.getByText('00h 05m 05s')).toBeTruthy();
  });
});
