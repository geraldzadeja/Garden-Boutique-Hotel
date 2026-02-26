import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rooms/:id/blocked-dates - Get blocked dates for a room (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const blockedDates = await prisma.roomBlockedDate.findMany({
      where: { roomId: params.id },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ blockedDates });
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rooms/:id/blocked-dates - Block dates for a room (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { date, unitsBlocked, reason } = body;

    if (!date || !unitsBlocked) {
      return NextResponse.json(
        { error: 'Date and unitsBlocked are required' },
        { status: 400 }
      );
    }

    // Check if date is already blocked
    const existing = await prisma.roomBlockedDate.findUnique({
      where: {
        roomId_date: {
          roomId: params.id,
          date: new Date(date),
        },
      },
    });

    if (existing) {
      // Update existing blocked date
      const updated = await prisma.roomBlockedDate.update({
        where: { id: existing.id },
        data: {
          unitsBlocked: parseInt(unitsBlocked),
          reason,
        },
      });
      return NextResponse.json(updated);
    } else {
      // Create new blocked date
      const blockedDate = await prisma.roomBlockedDate.create({
        data: {
          roomId: params.id,
          date: new Date(date),
          unitsBlocked: parseInt(unitsBlocked),
          reason,
        },
      });
      return NextResponse.json(blockedDate);
    }
  } catch (error) {
    console.error('Error blocking date:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/:id/blocked-dates/:dateId - Unblock a date (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const url = new URL(request.url);
    const dateId = url.searchParams.get('dateId');

    if (!dateId) {
      return NextResponse.json(
        { error: 'Date ID is required' },
        { status: 400 }
      );
    }

    await prisma.roomBlockedDate.delete({
      where: { id: dateId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unblocking date:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
