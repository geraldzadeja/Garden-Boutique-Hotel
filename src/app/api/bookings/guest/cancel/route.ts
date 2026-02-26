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

    const booking = await prisma.booking.findUnique({
      where: { bookingNumber },
    });

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

    // Cancel the booking
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
      include: { room: { select: { name: true, slug: true, images: true, bedType: true, size: true } } },
    });

    // Strip admin-only fields
    const { adminNotes, statusHistory, ...sanitized } = updated;

    return NextResponse.json({ booking: sanitized });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please provide a valid booking reference and email.' }, { status: 400 });
    }
    console.error('Guest booking cancel error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
