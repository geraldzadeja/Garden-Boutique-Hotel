import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTodaysArrivals() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    console.log('=== Today\'s Date ===');
    console.log('Today (local):', today);
    console.log('Today string:', todayStr);
    console.log();

    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        bookingNumber: true,
        reservationGroupId: true,
        guestName: true,
        checkInDate: true,
        checkOutDate: true,
        status: true,
      },
      orderBy: { checkInDate: 'asc' }
    });

    console.log('=== All Bookings ===');
    bookings.forEach(b => {
      const checkInStr = new Date(b.checkInDate).toISOString().split('T')[0];
      const isToday = checkInStr === todayStr;
      const isTodayArrival = isToday && (b.status === 'CONFIRMED' || b.status === 'PENDING');

      console.log(`\nBooking: ${b.bookingNumber}`);
      console.log(`Guest: ${b.guestName}`);
      console.log(`Check-in: ${b.checkInDate.toISOString()} (${checkInStr})`);
      console.log(`Status: ${b.status}`);
      console.log(`Is Today? ${isToday ? 'YES' : 'NO'}`);
      console.log(`Is Today's Arrival? ${isTodayArrival ? 'YES' : 'NO'}`);
    });

    // Filter for today's arrivals
    const todaysArrivalsBookings = bookings.filter(b => {
      const checkIn = new Date(b.checkInDate).toISOString().split('T')[0];
      return checkIn === todayStr && (b.status === 'CONFIRMED' || b.status === 'PENDING');
    });

    console.log('\n=== Today\'s Arrivals (Bookings) ===');
    console.log(`Total bookings checking in today: ${todaysArrivalsBookings.length}`);

    // Group by reservationGroupId
    const groups = new Set();
    todaysArrivalsBookings.forEach(b => {
      const key = b.reservationGroupId || b.id;
      groups.add(key);
    });

    console.log(`Total reservations checking in today: ${groups.size}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodaysArrivals();
