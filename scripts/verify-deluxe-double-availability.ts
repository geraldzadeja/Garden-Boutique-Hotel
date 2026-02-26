import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAvailability() {
  try {
    const DELUXE_DOUBLE_ROOM_ID = 'cmjzvuizk0001uxu0u2n3l5xw';

    // Check a few sample dates
    const sampleDates = [
      '2026-01-07',
      '2026-02-14', // Valentine's Day
      '2026-06-15', // Mid year
      '2026-12-25', // Christmas
    ];

    console.log('=== Verifying Deluxe Double Room Availability ===\n');

    for (const dateStr of sampleDates) {
      const date = new Date(dateStr + 'T00:00:00.000Z');

      const override = await prisma.roomAvailabilityOverride.findUnique({
        where: {
          roomId_date: {
            roomId: DELUXE_DOUBLE_ROOM_ID,
            date: date,
          },
        },
      });

      console.log(`Date: ${dateStr}`);
      if (override) {
        console.log(`  ✓ Override found: ${override.availableUnits} units available`);
      } else {
        console.log(`  ✗ No override found`);
      }
      console.log();
    }

    // Count total overrides
    const totalOverrides = await prisma.roomAvailabilityOverride.count({
      where: {
        roomId: DELUXE_DOUBLE_ROOM_ID,
      },
    });

    console.log(`Total overrides for Deluxe Double Room: ${totalOverrides}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAvailability();
