import { z } from 'zod';

export const createBookingSchema = z
  .object({
    roomId: z.string().cuid(),
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    numberOfGuests: z.number().int().min(1),
    guestName: z.string().min(2).max(100),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(8).max(20),
    guestNationality: z.string().max(100).optional(),
    specialRequests: z.string().max(1000).optional(),
    reservationGroupId: z.string().optional(),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  });

export const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW']).optional(),
  adminNotes: z.string().max(2000).optional(),
});

export const checkAvailabilitySchema = z.object({
  roomId: z.string().cuid(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
});

export type CreateBookingSchema = z.infer<typeof createBookingSchema>;
export type UpdateBookingSchema = z.infer<typeof updateBookingSchema>;
export type CheckAvailabilitySchema = z.infer<typeof checkAvailabilitySchema>;
