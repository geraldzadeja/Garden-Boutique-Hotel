import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@gardenboutiquehotel.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@gardenboutiquehotel.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✓ Created admin user:', admin.email);

  // Create actual hotel rooms
  const commonAmenities = [
    'Balcony',
    'Garden View',
    'Air Conditioning',
    'Private Bathroom',
    'Flat-screen TV',
    'Soundproofing',
    'Free Wi-Fi',
    'Free Toiletries',
    'Slippers',
    'Hairdryer',
    'Walk-in Shower',
    'Extra Long Beds',
    'Hardwood Floors',
    'Elevator Access'
  ];

  const gardenViewAmenities = [
    'Garden View',
    'Air Conditioning',
    'Private Bathroom',
    'Flat-screen TV',
    'Soundproofing',
    'Free Wi-Fi',
    'Free Toiletries',
    'Slippers',
    'Hairdryer',
    'Walk-in Shower',
    'Extra Long Beds',
    'Hardwood Floors',
    'Elevator Access'
  ];

  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { slug: 'deluxe-double-room' },
      update: {
        size: 35,
        bedType: '1 Large Double Bed',
        description: 'Spacious double room featuring air conditioning, a private entrance, balcony with stunning views, and a private bathroom with walk-in shower.',
        amenities: commonAmenities,
        totalUnits: 4,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
        ],
      },
      create: {
        name: 'Deluxe Double Room',
        slug: 'deluxe-double-room',
        description: 'Spacious double room featuring air conditioning, a private entrance, balcony with stunning views, and a private bathroom with walk-in shower.',
        shortDescription: 'Elegant room with balcony and garden views',
        capacity: 2,
        bedType: '1 Large Double Bed',
        size: 35,
        pricePerNight: 55.00,
        amenities: commonAmenities,
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
        ],
        isActive: true,
        displayOrder: 1,
        totalUnits: 4,
      },
    }),
    prisma.room.upsert({
      where: { slug: 'double-room-garden-view' },
      update: {
        size: 35,
        bedType: '1 Large Double Bed',
        description: 'Serene double room with stunning garden views, featuring air conditioning, private entrance, and private bathroom with walk-in shower.',
        amenities: gardenViewAmenities,
        totalUnits: 2,
        images: [
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2071',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2070',
        ],
      },
      create: {
        name: 'Double Room With Garden View',
        slug: 'double-room-garden-view',
        description: 'Serene double room with stunning garden views, featuring air conditioning, private entrance, and private bathroom with walk-in shower.',
        shortDescription: 'Peaceful room overlooking beautiful gardens',
        capacity: 2,
        bedType: '1 Large Double Bed',
        size: 35,
        pricePerNight: 53.00,
        amenities: gardenViewAmenities,
        images: [
          'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2071',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?q=80&w=2070',
        ],
        isActive: true,
        displayOrder: 2,
        totalUnits: 2,
      },
    }),
    prisma.room.upsert({
      where: { slug: 'deluxe-twin-room' },
      update: {
        size: 35,
        bedType: '2 Single Beds',
        description: 'Comfortable twin room with two single beds, air conditioning, private entrance, balcony with views, and private bathroom with walk-in shower.',
        amenities: commonAmenities,
        totalUnits: 2,
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070',
        ],
      },
      create: {
        name: 'Deluxe Twin Room',
        slug: 'deluxe-twin-room',
        description: 'Comfortable twin room with two single beds, air conditioning, private entrance, balcony with views, and private bathroom with walk-in shower.',
        shortDescription: 'Spacious room with two separate beds',
        capacity: 2,
        bedType: '2 Single Beds',
        size: 35,
        pricePerNight: 55.00,
        amenities: commonAmenities,
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
          'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070',
          'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070',
        ],
        isActive: true,
        displayOrder: 3,
        totalUnits: 2,
      },
    }),
    prisma.room.upsert({
      where: { slug: 'deluxe-triple-room' },
      update: {
        size: 35,
        bedType: '1 Single Bed & 1 Large Double Bed',
        description: 'Spacious triple room featuring air conditioning, private entrance, balcony with garden views, and private bathroom with walk-in shower.',
        amenities: commonAmenities,
        totalUnits: 2,
        images: [
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
        ],
      },
      create: {
        name: 'Deluxe Triple Room',
        slug: 'deluxe-triple-room',
        description: 'Spacious triple room featuring air conditioning, private entrance, balcony with garden views, and private bathroom with walk-in shower.',
        shortDescription: 'Perfect for families with balcony views',
        capacity: 3,
        bedType: '1 Single Bed & 1 Large Double Bed',
        size: 35,
        pricePerNight: 60.00,
        amenities: commonAmenities,
        images: [
          'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
        ],
        isActive: true,
        displayOrder: 4,
        totalUnits: 2,
      },
    }),
  ]);

  console.log('✓ Created sample rooms:', rooms.length);

  // Create sample blog post
  const blogPost = await prisma.blogPost.upsert({
    where: { slug: 'welcome-to-garden-boutique-hotel' },
    update: {},
    create: {
      title: 'Welcome to Garden Boutique Hotel',
      slug: 'welcome-to-garden-boutique-hotel',
      excerpt: 'Discover the luxury and tranquility of our boutique hotel nestled in a serene garden setting.',
      content: `Welcome to Garden Boutique Hotel, where luxury meets nature.

Our hotel offers a unique blend of modern comfort and natural beauty. Each room is carefully designed to provide the perfect retreat for our guests.

Whether you're here for business or leisure, we ensure your stay is memorable with our exceptional service, comfortable accommodations, and beautiful surroundings.

Book your stay today and experience the difference!`,
      tags: ['welcome', 'hotel', 'luxury'],
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('✓ Created sample blog post:', blogPost.title);

  console.log('\n✅ Seeding completed successfully!');
  console.log('\nYou can now:');
  console.log('- Run: npm run dev');
  console.log(`- Login with: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  console.log('- Visit: http://localhost:3000');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
