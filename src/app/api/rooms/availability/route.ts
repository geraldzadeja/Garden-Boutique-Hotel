import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/rooms/availability?date=YYYY-MM-DD - Get availability for all rooms on a specific date (admin only)
export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date');
  const startDateStr = searchParams.get('startDate');
  const endDateStr = searchParams.get('endDate');

  if (!dateStr && (!startDateStr || !endDateStr)) {
    return NextResponse.json({ error: 'Date or date range required' }, { status: 400 });
  }

  try {
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        totalUnits: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    if (dateStr) {
      // Single date query
      const date = new Date(dateStr + 'T00:00:00.000Z');

      const availabilityData = await Promise.all(
        rooms.map(async (room) => {
          // Check for availability override
          const override = await prisma.roomAvailabilityOverride.findUnique({
            where: {
              roomId_date: {
                roomId: room.id,
                date: date,
              },
            },
          });

          // BOOKING.COM LOGIC: Get bookings that occupy this NIGHT
          // A booking occupies this night if: checkIn <= date < checkOut
          // This means checkout dates don't consume availability
          const bookingsCount = await prisma.booking.count({
            where: {
              roomId: room.id,
              status: { in: ['CONFIRMED', 'PENDING'] },
              checkInDate: { lte: date },
              checkOutDate: { gt: date },
            },
          });

          // Get blocked units for this date
          const blockedDate = await prisma.roomBlockedDate.findUnique({
            where: {
              roomId_date: {
                roomId: room.id,
                date: date,
              },
            },
          });

          const totalUnits = room.totalUnits;
          const availableUnits = override
            ? override.availableUnits
            : totalUnits;
          const occupiedUnits = bookingsCount + (blockedDate?.unitsBlocked || 0);
          const actuallyAvailable = Math.max(0, availableUnits - occupiedUnits);

          return {
            roomId: room.id,
            roomName: room.name,
            roomSlug: room.slug,
            totalUnits,
            availableUnits,
            occupiedUnits,
            actuallyAvailable,
            hasOverride: !!override,
          };
        })
      );

      return NextResponse.json({
        date: dateStr,
        availability: availabilityData,
      });
    } else {
      // Date range query
      const startDate = new Date(startDateStr! + 'T00:00:00.000Z');
      const endDate = new Date(endDateStr! + 'T00:00:00.000Z');

      const dateRange: { date: string; availability: any[] }[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const date = new Date(currentDate);

        const availabilityData = await Promise.all(
          rooms.map(async (room) => {
            const override = await prisma.roomAvailabilityOverride.findUnique({
              where: {
                roomId_date: {
                  roomId: room.id,
                  date: date,
                },
              },
            });

            // BOOKING.COM LOGIC: Count bookings that occupy this NIGHT
            // A booking occupies this night if: checkIn <= date < checkOut
            const bookingsCount = await prisma.booking.count({
              where: {
                roomId: room.id,
                status: { in: ['CONFIRMED', 'PENDING'] },
                checkInDate: { lte: date },
                checkOutDate: { gt: date },
              },
            });

            const blockedDate = await prisma.roomBlockedDate.findUnique({
              where: {
                roomId_date: {
                  roomId: room.id,
                  date: date,
                },
              },
            });

            const totalUnits = room.totalUnits;
            const availableUnits = override ? override.availableUnits : totalUnits;
            const occupiedUnits = bookingsCount + (blockedDate?.unitsBlocked || 0);
            const actuallyAvailable = Math.max(0, availableUnits - occupiedUnits);

            return {
              roomId: room.id,
              roomName: room.name,
              totalUnits,
              availableUnits,
              occupiedUnits,
              actuallyAvailable,
              hasOverride: !!override,
            };
          })
        );

        dateRange.push({
          date: dateStr,
          availability: availabilityData,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return NextResponse.json({
        startDate: startDateStr,
        endDate: endDateStr,
        dateRange,
      });
    }
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/rooms/availability - Set availability override for a specific date and room (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { roomId, date: dateStr, availableUnits } = body;

    if (!roomId || !dateStr || availableUnits === undefined) {
      return NextResponse.json(
        { error: 'roomId, date, and availableUnits are required' },
        { status: 400 }
      );
    }

    // Validate the room exists and get total units
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { totalUnits: true },
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (availableUnits < 0 || availableUnits > room.totalUnits) {
      return NextResponse.json(
        { error: `Available units must be between 0 and ${room.totalUnits}` },
        { status: 400 }
      );
    }

    const date = new Date(dateStr + 'T00:00:00.000Z');

    // Upsert the availability override
    const override = await prisma.roomAvailabilityOverride.upsert({
      where: {
        roomId_date: {
          roomId,
          date,
        },
      },
      update: {
        availableUnits,
      },
      create: {
        roomId,
        date,
        availableUnits,
      },
    });

    return NextResponse.json({
      success: true,
      override,
    });
  } catch (error) {
    console.error('Error setting availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/rooms/availability - Remove availability override (admin only)
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  const dateStr = searchParams.get('date');

  if (!roomId || !dateStr) {
    return NextResponse.json(
      { error: 'roomId and date are required' },
      { status: 400 }
    );
  }

  try {
    const date = new Date(dateStr + 'T00:00:00.000Z');

    await prisma.roomAvailabilityOverride.delete({
      where: {
        roomId_date: {
          roomId,
          date,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting availability override:', error);
    return NextResponse.json(
      { error: 'Not found or internal server error' },
      { status: 500 }
    );
  }
}
