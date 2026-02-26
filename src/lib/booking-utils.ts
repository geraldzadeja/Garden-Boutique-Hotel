import { differenceInDays } from 'date-fns';
import { prisma } from './prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function checkRoomAvailability(
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  excludeBookingId?: string
): Promise<boolean> {
  // Get room to check total units
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    select: { totalUnits: true },
  });

  if (!room) {
    return false;
  }

  // BOOKING.COM LOGIC: Check availability for each NIGHT from check-in up to (but NOT including) check-out
  // When blocking Jan 21, it blocks the NIGHT of Jan 21 (occupies Jan 21 → Jan 22)
  // A booking from Jan 21 → Jan 22 will check only the night of Jan 21
  // A booking from Jan 20 → Jan 21 will check only the night of Jan 20 (Jan 21 is checkout, not checked)

  const currentDate = new Date(checkInDate);
  currentDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(checkOutDate);
  endDate.setUTCHours(0, 0, 0, 0);

  // Iterate through each NIGHT (check-in date up to but NOT including check-out date)
  while (currentDate < endDate) {
    // Check if there's an availability override for this NIGHT
    const override = await prisma.roomAvailabilityOverride.findUnique({
      where: {
        roomId_date: {
          roomId,
          date: currentDate,
        },
      },
    });

    // Determine available units for this NIGHT
    const availableUnits = override ? override.availableUnits : room.totalUnits;

    // If no units available for this NIGHT, booking is not possible
    if (availableUnits === 0) {
      return false;
    }

    // Count existing bookings that occupy this NIGHT
    // A booking occupies this night if: checkIn <= currentDate < checkOut
    const bookingsCount = await prisma.booking.count({
      where: {
        roomId,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        checkInDate: { lte: currentDate },
        checkOutDate: { gt: currentDate },
      },
    });

    // Check blocked dates for this NIGHT
    const blockedDate = await prisma.roomBlockedDate.findUnique({
      where: {
        roomId_date: {
          roomId,
          date: currentDate,
        },
      },
    });

    const blockedUnits = blockedDate?.unitsBlocked || 0;
    const occupiedUnits = bookingsCount + blockedUnits;

    // If all units are occupied for this NIGHT, booking is not possible
    if (occupiedUnits >= availableUnits) {
      return false;
    }

    // Move to next NIGHT
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // All nights have availability
  return true;
}

export function calculateBookingPrice(
  pricePerNight: Decimal,
  checkInDate: Date,
  checkOutDate: Date
): {
  numberOfNights: number;
  totalPrice: Decimal;
} {
  const numberOfNights = differenceInDays(checkOutDate, checkInDate);
  const totalPrice = new Decimal(pricePerNight).mul(numberOfNights);

  return {
    numberOfNights,
    totalPrice,
  };
}

export async function generateBookingNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // Generate a unique random suffix to avoid collisions in parallel bookings
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');

  return `BK${year}${month}${day}${timestamp}${random}`;
}

export function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'yellow';
    case 'CONFIRMED':
      return 'green';
    case 'CANCELLED':
      return 'red';
    case 'COMPLETED':
      return 'blue';
    default:
      return 'gray';
  }
}
