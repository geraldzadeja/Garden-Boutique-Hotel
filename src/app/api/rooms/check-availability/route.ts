import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRoomAvailability } from '@/lib/booking-utils';

// GET /api/rooms/check-availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=2
// BOOKING.COM LOGIC: This endpoint checks availability for NIGHTS
// A search from Jan 12 → Jan 13 checks the NIGHT of Jan 12 only
// If Jan 12 is blocked (availability = 0), the room should NOT appear
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkInStr = searchParams.get('checkIn');
  const checkOutStr = searchParams.get('checkOut');
  const guestsStr = searchParams.get('guests');

  if (!checkInStr || !checkOutStr) {
    return NextResponse.json(
      { error: 'checkIn and checkOut dates are required' },
      { status: 400 }
    );
  }

  try {
    // Properly normalize dates to UTC midnight
    const checkInDate = new Date(checkInStr);
    checkInDate.setUTCHours(0, 0, 0, 0);
    const checkOutDate = new Date(checkOutStr);
    checkOutDate.setUTCHours(0, 0, 0, 0);
    const guests = guestsStr ? parseInt(guestsStr) : 1;

    // Get all active rooms
    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    // Check availability for each room
    const availableRooms = await Promise.all(
      rooms.map(async (room) => {
        // Filter by guest capacity first
        if (room.capacity < guests) {
          return null;
        }

        // Check actual availability using the booking utils function
        const isAvailable = await checkRoomAvailability(
          room.id,
          checkInDate,
          checkOutDate
        );

        if (!isAvailable) {
          return null;
        }

        return room;
      })
    );

    // Filter out null values (unavailable rooms)
    const filteredRooms = availableRooms.filter((room) => room !== null);

    return NextResponse.json({
      rooms: filteredRooms,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
