import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateBookingSchema } from '@/lib/validators/booking';
import { z } from 'zod';

// GET /api/bookings/:id - Get booking details (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { room: true },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}

// PATCH /api/bookings/:id - Update booking (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validated = updateBookingSchema.parse(body);

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Track status changes
    const statusHistory = (booking.statusHistory as any[]) || [];
    if (validated.status && validated.status !== booking.status) {
      statusHistory.push({
        from: booking.status,
        to: validated.status,
        timestamp: new Date().toISOString(),
      });
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        ...validated,
        statusHistory,
        confirmedAt:
          validated.status === 'CONFIRMED' ? new Date() : booking.confirmedAt,
        cancelledAt:
          validated.status === 'CANCELLED' ? new Date() : booking.cancelledAt,
      },
      include: { room: true },
    });

    // TODO: Send status update email to guest

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/bookings/:id - Delete booking (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await prisma.booking.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
