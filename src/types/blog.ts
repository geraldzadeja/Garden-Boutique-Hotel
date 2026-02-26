import { BlogPost } from '@prisma/client';

export type CreateBlogPostInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags: string[];
  isPublished?: boolean;
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput> & {
  publishedAt?: Date | null;
};

export type PublishedBlogPost = BlogPost & {
  isPublished: true;
  publishedAt: Date;
};
