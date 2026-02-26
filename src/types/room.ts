import { Room } from '@prisma/client';

export type CreateRoomInput = {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  capacity: number;
  bedType: string;
  size: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  displayOrder?: number;
};

export type UpdateRoomInput = Partial<CreateRoomInput> & {
  isActive?: boolean;
};

export type RoomWithAvailability = Room & {
  isAvailable?: boolean;
  nextAvailableDate?: Date;
};
