import { type DateTime } from 'luxon';

export const formatDateRange = (startDate: DateTime, endDate: DateTime): string => {
  if (startDate.month === endDate.month) {
    if (startDate.day === endDate.day) {
      // Same day: Jan 10, 2024
      return startDate.toFormat('MMM dd, yyyy');
    }
    // Same month: Jan 10-15, 2024
    return `${startDate.toFormat('MMM dd')}-${endDate.toFormat('dd, yyyy')}`;
  }
  // Different months: Jan 30 - Feb 5, 2024
  return `${startDate.toFormat('MMM dd')} - ${endDate.toFormat('MMM dd, yyyy')}`;
};
