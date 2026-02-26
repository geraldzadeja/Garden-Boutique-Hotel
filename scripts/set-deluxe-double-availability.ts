import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setDeluxeDoubleAvailability() {
  try {
    const DELUXE_DOUBLE_ROOM_ID = 'cmjzvuizk0001uxu0u2n3l5xw';
    const AVAILABLE_UNITS = 2; // Set to 2 out of 4

    // Get today's date
    const today = new Date();
    const startDate = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z');

    // Set availability for the next 365 days (1 year)
    const daysToSet = 365;
    const overrides = [];

    console.log('=== Setting Static Availability for Deluxe Double Room ===');
    console.log(`Room ID: ${DELUXE_DOUBLE_ROOM_ID}`);
    console.log(`Available Units: ${AVAILABLE_UNITS} out of 4`);
    console.log(`Date Range: ${startDate.toISOString().split('T')[0]} to ${new Date(startDate.getTime() + (daysToSet - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`);
    console.log(`Total Days: ${daysToSet}`);
    console.log();
    console.log('Creating availability overrides...');

    for (let i = 0; i < daysToSet; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

      overrides.push({
        roomId: DELUXE_DOUBLE_ROOM_ID,
        date: date,
        availableUnits: AVAILABLE_UNITS,
      });

      // Show progress every 50 days
      if ((i + 1) % 50 === 0) {
        console.log(`Progress: ${i + 1}/${daysToSet} days prepared...`);
      }
    }

    console.log(`\nInserting ${overrides.length} availability overrides into database...`);

    // Use createMany with skipDuplicates to avoid conflicts
    const result = await prisma.roomAvailabilityOverride.createMany({
      data: overrides,
      skipDuplicates: true,
    });

    console.log(`\n✓ Successfully created ${result.count} availability overrides`);
    console.log(`✓ Deluxe Double Room now has static availability of ${AVAILABLE_UNITS} units for the next ${daysToSet} days`);
    console.log(`✓ You can now use +/− buttons in the calendar to adjust individual dates from this baseline`);

  } catch (error) {
    console.error('Error setting availability:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setDeluxeDoubleAvailability();
