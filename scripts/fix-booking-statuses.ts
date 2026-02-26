import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function fixBookingStatuses() {
  try {
    console.log('Checking for inconsistent booking statuses...\n');

    const bookings = await prisma.booking.findMany({
      select: {
        id: true,
        status: true,
        reservationGroupId: true,
        guestName: true,
      },
    });

    // Group bookings by reservationGroupId
    const groups = new Map<string, typeof bookings>();

    bookings.forEach(booking => {
      const key = booking.reservationGroupId || booking.id;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(booking);
    });

    // Find groups with inconsistent statuses
    const inconsistentGroups: Array<{ groupId: string; bookings: typeof bookings; statuses: string[] }> = [];

    groups.forEach((groupBookings, groupId) => {
      if (groupBookings.length > 1) {
        const statuses = [...new Set(groupBookings.map(b => b.status))];
        if (statuses.length > 1) {
          inconsistentGroups.push({ groupId, bookings: groupBookings, statuses });
        }
      }
    });

    if (inconsistentGroups.length === 0) {
      console.log('✓ No inconsistent booking statuses found. All reservations are properly synchronized.');
      return;
    }

    console.log(`Found ${inconsistentGroups.length} reservation(s) with inconsistent statuses:\n`);

    for (const group of inconsistentGroups) {
      console.log(`Reservation Group: ${group.groupId}`);
      console.log(`Guest: ${group.bookings[0].guestName}`);
      console.log(`Statuses found: ${group.statuses.join(', ')}`);
      console.log(`Bookings in group:`);
      group.bookings.forEach(b => {
        console.log(`  - ${b.id}: ${b.status}`);
      });

      // Determine the "most advanced" status to use
      // Priority: COMPLETED > CONFIRMED > PENDING > CANCELLED > NO_SHOW
      const statusPriority = {
        COMPLETED: 5,
        CONFIRMED: 4,
        PENDING: 3,
        CANCELLED: 2,
        NO_SHOW: 1,
      };

      const targetStatus = group.statuses.reduce((best, current) => {
        const currentPriority = statusPriority[current as keyof typeof statusPriority] || 0;
        const bestPriority = statusPriority[best as keyof typeof statusPriority] || 0;
        return currentPriority > bestPriority ? current : best;
      }) as BookingStatus;

      console.log(`\nSynchronizing all bookings to: ${targetStatus}\n`);

      // Update all bookings in the group to have the same status
      await Promise.all(
        group.bookings.map(booking =>
          prisma.booking.update({
            where: { id: booking.id },
            data: { status: targetStatus },
          })
        )
      );

      console.log(`✓ Updated ${group.bookings.length} booking(s)\n`);
    }

    console.log('\n✓ All booking statuses have been synchronized!');
  } catch (error) {
    console.error('Error fixing booking statuses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixBookingStatuses();
