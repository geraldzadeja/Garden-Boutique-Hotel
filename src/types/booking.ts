import { Booking, Room, BookingStatus } from '@prisma/client';

export type BookingWithRoom = Booking & {
  room: Room;
};

export type CreateBookingInput = {
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
};

export type UpdateBookingInput = {
  status?: BookingStatus;
  adminNotes?: string;
  confirmedAt?: Date | null;
  cancelledAt?: Date | null;
};

export type BookingFilters = {
  status?: BookingStatus;
  roomId?: string;
  dateFrom?: Date;
  dateTo?: Date;
};

export type BookingStats = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
};
