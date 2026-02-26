import { format, parseISO, isWithinInterval } from 'date-fns';

export function formatDate(
  date: Date | string,
  formatStr: string = 'PPP'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
}

export function formatDateRange(
  startDate: Date | string,
  endDate: Date | string
): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function isDateInRange(
  date: Date,
  startDate: Date,
  endDate: Date
): boolean {
  return isWithinInterval(date, { start: startDate, end: endDate });
}

export function getMinCheckInDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

export function getMinCheckOutDate(checkInDate: Date): Date {
  const minCheckOut = new Date(checkInDate);
  minCheckOut.setDate(minCheckOut.getDate() + 1);
  return minCheckOut;
}
