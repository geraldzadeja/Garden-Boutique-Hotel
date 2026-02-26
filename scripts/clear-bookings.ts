import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearBookings() {
  try {
    const result = await prisma.booking.deleteMany({});
    console.log(`✓ Successfully deleted ${result.count} bookings from the database`);
  } catch (error) {
    console.error('Error deleting bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearBookings();
