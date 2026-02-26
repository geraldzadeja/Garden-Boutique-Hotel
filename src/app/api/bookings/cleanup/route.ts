import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/bookings/cleanup - Delete cancelled bookings from previous months (admin only)
export async function POST() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    // Get the first day of the current month at midnight
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);

    // Delete cancelled bookings from previous months (before this month started)
    const result = await prisma.booking.deleteMany({
      where: {
        status: 'CANCELLED',
        cancelledAt: {
          lt: firstDayOfMonth,
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Failed to cleanup old bookings' },
      { status: 500 }
    );
  }
}
