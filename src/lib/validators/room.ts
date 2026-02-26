import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  shortDescription: z.string().max(200).optional(),
  capacity: z.number().int().min(1).max(10),
  bedType: z.string().min(2).max(50),
  size: z.number().int().min(10).max(500),
  pricePerNight: z.number().min(0),
  amenities: z.array(z.string()),
  images: z.array(z.string().min(1)),
  displayOrder: z.number().int().default(0),
});

export const updateRoomSchema = createRoomSchema.partial().extend({
  isActive: z.boolean().optional(),
  totalUnits: z.number().int().min(1).max(100).optional(),
});

export type CreateRoomSchema = z.infer<typeof createRoomSchema>;
export type UpdateRoomSchema = z.infer<typeof updateRoomSchema>;
