import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const guestLookupSchema = z.object({
  bookingNumber: z.string().min(1),
  email: z.string().email(),
});

// POST /api/bookings/guest - Lookup booking by reference + email (public, secure)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingNumber, email } = guestLookupSchema.parse(body);

    // Find booking by reference number
    const booking = await prisma.booking.findUnique({
      where: { bookingNumber },
      include: { room: { select: { name: true, slug: true, images: true, bedType: true, size: true } } },
    });

    // Generic error for both "not found" and "wrong email" to prevent enumeration
    if (!booking || booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'No booking found with that reference number and email address.' },
        { status: 404 }
      );
    }

    // If this booking is part of a group, fetch all bookings in the group
    let bookings;
    if (booking.reservationGroupId) {
      bookings = await prisma.booking.findMany({
        where: {
          reservationGroupId: booking.reservationGroupId,
          guestEmail: { equals: booking.guestEmail, mode: 'insensitive' },
        },
        include: { room: { select: { name: true, slug: true, images: true, bedType: true, size: true } } },
        orderBy: { createdAt: 'asc' },
      });
    } else {
      bookings = [booking];
    }

    // Strip admin-only fields
    const sanitized = bookings.map(({ adminNotes, statusHistory, ...rest }) => rest);

    return NextResponse.json({ bookings: sanitized });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please provide a valid booking reference and email.' }, { status: 400 });
    }
    console.error('Guest booking lookup error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
