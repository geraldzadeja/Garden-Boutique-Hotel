export const APP_NAME = 'Garden Boutique Hotel';
export const APP_DESCRIPTION = 'Luxury boutique hotel booking';

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
} as const;

export const BED_TYPES = [
  'King',
  'Queen',
  'Twin',
  'Double',
  'Single',
] as const;

export const ROOM_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Mini Bar',
  'Safe',
  'TV',
  'Balcony',
  'Ocean View',
  'Garden View',
  'Bathtub',
  'Shower',
  'Coffee Maker',
  'Room Service',
] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
