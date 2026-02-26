import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getRoomInfo() {
  try {
    const rooms = await prisma.room.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        totalUnits: true,
      },
    });

    console.log('=== All Rooms ===');
    rooms.forEach(room => {
      console.log(`\nID: ${room.id}`);
      console.log(`Name: ${room.name}`);
      console.log(`Slug: ${room.slug}`);
      console.log(`Total Units: ${room.totalUnits}`);
    });

    // Find Deluxe Double Room
    const deluxeDouble = rooms.find(r => r.name.toLowerCase().includes('deluxe double'));
    if (deluxeDouble) {
      console.log('\n=== Deluxe Double Room Found ===');
      console.log(`ID: ${deluxeDouble.id}`);
      console.log(`Name: ${deluxeDouble.name}`);
      console.log(`Total Units: ${deluxeDouble.totalUnits}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getRoomInfo();
