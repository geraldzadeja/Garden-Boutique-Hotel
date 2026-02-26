import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional().or(z.literal('')),
  content: z.string().min(10),
  coverImage: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()),
  isPublished: z.boolean().default(false),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().extend({
  publishedAt: z.coerce.date().optional().nullable(),
});

export type CreateBlogPostSchema = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostSchema = z.infer<typeof updateBlogPostSchema>;
