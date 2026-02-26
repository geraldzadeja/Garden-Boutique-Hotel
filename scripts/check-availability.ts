import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAvailability() {
  try {
    console.log('=== Active Bookings (CONFIRMED or PENDING) ===\n');

    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PENDING'] }
      },
      select: {
        id: true,
        bookingNumber: true,
        room: { select: { name: true, id: true } },
        checkInDate: true,
        checkOutDate: true,
        status: true,
      },
      orderBy: { checkInDate: 'asc' }
    });

    if (bookings.length === 0) {
      console.log('No active bookings found.');
    } else {
      bookings.forEach(b => {
        const checkIn = b.checkInDate.toISOString().split('T')[0];
        const checkOut = b.checkOutDate.toISOString().split('T')[0];
        console.log(`- ${b.bookingNumber}: ${b.room.name}`);
        console.log(`  ${checkIn} to ${checkOut} (${b.status})`);
        console.log(`  Room ID: ${b.room.id}\n`);
      });
    }

    // Test availability calculation for today
    console.log('\n=== Testing Availability Calculation for Today ===\n');

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // Get YYYY-MM-DD
    const today = new Date(todayStr + 'T00:00:00.000Z'); // Create UTC midnight date

    console.log('Today (raw):', now);
    console.log('Today string:', todayStr);
    console.log('Today (UTC midnight):', today);
    console.log('Today (UTC midnight) ISO:', today.toISOString());

    // Get a sample booking to check its date format
    const sampleBooking = await prisma.booking.findFirst({
      select: { checkInDate: true, checkOutDate: true }
    });
    if (sampleBooking) {
      console.log('\nSample booking dates:');
      console.log('checkInDate:', sampleBooking.checkInDate);
      console.log('checkOutDate:', sampleBooking.checkOutDate);
    }

    console.log();

    const rooms = await prisma.room.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        totalUnits: true,
      }
    });

    for (const room of rooms) {
      const bookingsCount = await prisma.booking.count({
        where: {
          roomId: room.id,
          status: { in: ['CONFIRMED', 'PENDING'] },
          checkInDate: { lte: today },
          checkOutDate: { gt: today },
        },
      });

      console.log(`${room.name}:`);
      console.log(`  Total Units: ${room.totalUnits}`);
      console.log(`  Occupied: ${bookingsCount}`);
      console.log(`  Available: ${room.totalUnits - bookingsCount}\n`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAvailability();
