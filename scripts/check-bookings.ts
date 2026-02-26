import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        status: true,
        reservationGroupId: true,
        guestName: true,
      },
    });

    console.log('Total bookings:', bookings.length);
    console.log('\nBy status:');

    const byStatus: Record<string, number> = {};
    bookings.forEach(b => {
      byStatus[b.status] = (byStatus[b.status] || 0) + 1;
    });

    console.log(JSON.stringify(byStatus, null, 2));

    const groups = new Set();
    bookings.forEach(b => {
      if (b.reservationGroupId) {
        groups.add(b.reservationGroupId);
      } else {
        groups.add(b.id);
      }
    });

    console.log('\nGrouped reservations:', groups.size);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBookings();
