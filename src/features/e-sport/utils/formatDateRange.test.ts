import { DateTime } from 'luxon';

import { formatDateRange } from './formatDateRange';

describe('formatDateRange', () => {
  it('formats same-day range', () => {
    const date = DateTime.fromISO('2024-01-10T00:00:00Z', { zone: 'utc' });
    const result = formatDateRange(date, date);
    expect(result).toBe('Jan 10, 2024');
  });

  it('formats same-month range with different days', () => {
    const startDate = DateTime.fromISO('2024-01-10T00:00:00Z', { zone: 'utc' });
    const endDate = DateTime.fromISO('2024-01-15T00:00:00Z', { zone: 'utc' });
    const result = formatDateRange(startDate, endDate);
    expect(result).toBe('Jan 10-15, 2024');
  });

  it('formats different-month range', () => {
    const startDate = DateTime.fromISO('2024-01-30T00:00:00Z', { zone: 'utc' });
    const endDate = DateTime.fromISO('2024-02-05T00:00:00Z', { zone: 'utc' });
    const result = formatDateRange(startDate, endDate);
    expect(result).toBe('Jan 30 - Feb 05, 2024');
  });

  it('formats cross-year range', () => {
    const startDate = DateTime.fromISO('2023-12-28T00:00:00Z', { zone: 'utc' });
    const endDate = DateTime.fromISO('2024-01-03T00:00:00Z', { zone: 'utc' });
    const result = formatDateRange(startDate, endDate);
    expect(result).toBe('Dec 28 - Jan 03, 2024');
  });
});
