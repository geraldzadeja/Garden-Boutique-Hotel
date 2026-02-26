import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBookingSchema } from '@/lib/validators/booking';
import {
  calculateBookingPrice,
  generateBookingNumber,
} from '@/lib/booking-utils';
import { z } from 'zod';

// GET /api/bookings - List bookings (admin only)
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where = status ? { status: status as any } : {};

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { room: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({
    bookings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/bookings - Create booking request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received booking request:', body);

    const validated = createBookingSchema.parse(body);
    console.log('Validated booking data:', validated);

    // Use a serializable transaction to prevent race conditions
    // (two guests booking the last unit simultaneously)
    const booking = await prisma.$transaction(async (tx) => {
      // Check availability inside transaction
      const room = await tx.room.findUnique({
        where: { id: validated.roomId },
        select: { id: true, totalUnits: true, isActive: true, pricePerNight: true },
      });

      if (!room || !room.isActive) {
        throw new Error('ROOM_NOT_FOUND');
      }

      // Check each night's availability within the transaction
      const checkIn = new Date(validated.checkInDate);
      checkIn.setUTCHours(0, 0, 0, 0);
      const checkOut = new Date(validated.checkOutDate);
      checkOut.setUTCHours(0, 0, 0, 0);
      const currentDate = new Date(checkIn);

      while (currentDate < checkOut) {
        const override = await tx.roomAvailabilityOverride.findUnique({
          where: { roomId_date: { roomId: validated.roomId, date: currentDate } },
        });
        const availableUnits = override ? override.availableUnits : room.totalUnits;

        if (availableUnits === 0) {
          throw new Error('ROOM_NOT_AVAILABLE');
        }

        const bookingsCount = await tx.booking.count({
          where: {
            roomId: validated.roomId,
            status: { in: ['PENDING', 'CONFIRMED'] },
            checkInDate: { lte: currentDate },
            checkOutDate: { gt: currentDate },
          },
        });

        const blockedDate = await tx.roomBlockedDate.findUnique({
          where: { roomId_date: { roomId: validated.roomId, date: currentDate } },
        });

        const occupiedUnits = bookingsCount + (blockedDate?.unitsBlocked || 0);
        if (occupiedUnits >= availableUnits) {
          throw new Error('ROOM_NOT_AVAILABLE');
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Calculate pricing
      const { numberOfNights, totalPrice } = calculateBookingPrice(
        room.pricePerNight,
        validated.checkInDate,
        validated.checkOutDate
      );

      // Create booking inside the same transaction
      const bookingNumber = await generateBookingNumber();
      return tx.booking.create({
        data: {
          bookingNumber,
          // For the first booking in a group, use its own booking number as group ID
          reservationGroupId: validated.reservationGroupId === '__FIRST__' ? bookingNumber : (validated.reservationGroupId || null),
          roomId: validated.roomId,
          checkInDate: validated.checkInDate,
          checkOutDate: validated.checkOutDate,
          numberOfNights,
          numberOfGuests: validated.numberOfGuests,
          guestName: validated.guestName,
          guestEmail: validated.guestEmail,
          guestPhone: validated.guestPhone,
          specialRequests: validated.specialRequests,
          pricePerNight: room.pricePerNight,
          totalPrice,
          status: 'PENDING',
        },
        include: { room: true },
      });
    });

    console.log('Booking created successfully:', booking.id, booking.bookingNumber);

    // TODO: Send confirmation email to guest
    // TODO: Send notification email to admin

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message === 'ROOM_NOT_FOUND') {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
      }
      if (error.message === 'ROOM_NOT_AVAILABLE') {
        return NextResponse.json({ error: 'Room not available for selected dates' }, { status: 400 });
      }
    }
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
