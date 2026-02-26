import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const cancelSchema = z.object({
  bookingNumber: z.string().min(1),
  email: z.string().email(),
});

// POST /api/bookings/guest/cancel - Cancel booking (public, secure)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingNumber, email } = cancelSchema.parse(body);

    // Try direct booking number lookup first
    let booking = await prisma.booking.findUnique({
      where: { bookingNumber },
    });

    // If not found, try by reservationGroupId
    if (!booking) {
      booking = await prisma.booking.findFirst({
        where: { reservationGroupId: bookingNumber },
        orderBy: { createdAt: 'asc' },
      });
    }

    // Generic error to prevent enumeration
    if (!booking || booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'No booking found with that reference number and email address.' },
        { status: 404 }
      );
    }

    // Only allow cancellation of PENDING or CONFIRMED bookings
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return NextResponse.json(
        { error: `This booking is already ${booking.status.toLowerCase()} and cannot be cancelled.` },
        { status: 400 }
      );
    }

    // Cancel all bookings in the group (or just the single booking)
    const now = new Date();
    if (booking.reservationGroupId) {
      await prisma.booking.updateMany({
        where: {
          reservationGroupId: booking.reservationGroupId,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        data: {
          status: 'CANCELLED',
          cancelledAt: now,
        },
      });
    } else {
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: now,
        },
      });
    }

    // Fetch the updated booking to return
    const updated = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: { room: { select: { name: true, slug: true, images: true, bedType: true, size: true } } },
    });

    // Strip admin-only fields
    const { adminNotes, statusHistory, ...sanitized } = updated!;

    return NextResponse.json({ booking: sanitized });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please provide a valid booking reference and email.' }, { status: 400 });
    }
    console.error('Guest booking cancel error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
