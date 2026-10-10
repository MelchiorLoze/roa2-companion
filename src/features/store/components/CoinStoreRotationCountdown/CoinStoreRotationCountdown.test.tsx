import { act, render, screen } from '@testing-library/react-native';
import { DateTime } from 'luxon';

import { CoinStoreRotationCountdown } from './CoinStoreRotationCountdown';

const renderComponent = async (date: DateTime) => await render(<CoinStoreRotationCountdown expirationDate={date} />);

describe('CoinStoreRotationCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-08-24T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders initial countdown correctly for future date', async () => {
    const futureDate = DateTime.utc().plus({ hours: 2, minutes: 30, seconds: 45 });

    await renderComponent(futureDate);

    expect(screen.getByText('02:30:45')).toBeTruthy();
  });

  it('renders countdown with zero hours correctly', async () => {
    const futureDate = DateTime.utc().plus({ minutes: 45, seconds: 20 });

    await renderComponent(futureDate);

    expect(screen.getByText('00:45:20')).toBeTruthy();
  });

  it('renders consistent width placeholder', async () => {
    const futureDate = DateTime.utc().plus({ hours: 1, minutes: 30, seconds: 45 });

    await renderComponent(futureDate);

    expect(screen.getByText('01:30:45')).toBeTruthy();
    expect(screen.getByText('01:30:88')).toBeTruthy();
  });

  it('handles large time differences correctly', async () => {
    const farFutureDate = DateTime.utc().plus({ hours: 25, minutes: 30, seconds: 45 });

    await renderComponent(farFutureDate);

    expect(screen.getByText('25:30:45')).toBeTruthy();
  });

  it('cleans up interval on unmount', async () => {
    const futureDate = DateTime.utc().plus({ hours: 1 });
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

    const { unmount } = await renderComponent(futureDate);

    await unmount();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    clearIntervalSpy.mockRestore();
  });

  it('updates countdown correctly when time advances', async () => {
    const futureDate = DateTime.utc().plus({ minutes: 5, seconds: 10 });

    await renderComponent(futureDate);

    expect(screen.getByText('00:05:10')).toBeTruthy();

    await act(() => jest.advanceTimersByTime(5000));

    expect(screen.getByText('00:05:05')).toBeTruthy();
  });
});
