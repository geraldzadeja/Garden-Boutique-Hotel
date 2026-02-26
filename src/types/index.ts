// Re-export Prisma types
export type {
  User,
  Room,
  Booking,
  BlogPost,
  ContactMessage,
  BookingStatus,
  UserRole,
} from '@prisma/client';

// Re-export custom types
export * from './booking';
export * from './room';
export * from './blog';
export * from './api';

// NextAuth type augmentation
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
