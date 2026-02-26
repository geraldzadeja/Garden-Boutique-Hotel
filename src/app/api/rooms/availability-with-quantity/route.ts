import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/rooms/availability-with-quantity?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
// Returns all available rooms with their maximum available quantity for the date range
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');

  if (!checkInStr || !checkOutStr) {
    return NextResponse.json(
      { error: 'checkIn and checkOut dates are required' },
      { status: 400 }
    );
  }

  try {
    const checkInDate = new Date(checkInStr);
    checkInDate.setUTCHours(0, 0, 0, 0);
    const checkOutDate = new Date(checkOutStr);
    checkOutDate.setUTCHours(0, 0, 0, 0);

    // Get all active rooms
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // For each room, find the minimum available units across all nights in the range
    const roomsWithAvailability = await Promise.all(
      rooms.map(async (room) => {
        let minAvailable = room.totalUnits;

        // Check each night in the range
        const currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) {
          // Check for availability override
          const override = await prisma.roomAvailabilityOverride.findUnique({
            where: {
              roomId_date: {
                roomId: room.id,
                date: currentDate,
              },
            },
          });

          // Available units for this night
          const availableUnits = override ? override.availableUnits : room.totalUnits;

          // Count bookings that occupy this night
          const bookingsCount = await prisma.booking.count({
            where: {
              roomId: room.id,
              status: { in: ['CONFIRMED', 'PENDING'] },
              checkInDate: { lte: currentDate },
              checkOutDate: { gt: currentDate },
            },
          });

          // Check blocked dates
          const blockedDate = await prisma.roomBlockedDate.findUnique({
            where: {
              roomId_date: {
                roomId: room.id,
                date: currentDate,
              },
            },
          });

          const blockedUnits = blockedDate?.unitsBlocked || 0;
          const occupiedUnits = bookingsCount + blockedUnits;
          const actuallyAvailable = Math.max(0, availableUnits - occupiedUnits);

          // Track the minimum available across all nights
          minAvailable = Math.min(minAvailable, actuallyAvailable);

          // Move to next night
          currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
          ...room,
          maxAvailableQuantity: minAvailable,
        };
      })
    );

    // Filter out rooms with zero availability
    const availableRooms = roomsWithAvailability.filter(
      (room) => room.maxAvailableQuantity > 0
    );

    return NextResponse.json({
      rooms: availableRooms,
      checkIn: checkInStr,
      checkOut: checkOutStr,
    });
  } catch (error) {
    console.error('Error checking availability with quantity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
