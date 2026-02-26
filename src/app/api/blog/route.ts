import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createBlogPostSchema } from '@/lib/validators/blog';
import { z } from 'zod';

// GET /api/blog - List blog posts (public for published, admin sees all)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const isAdmin = session?.user?.role === 'ADMIN';
  const publishedOnly = !isAdmin || searchParams.get('published') === 'true';

  const where = publishedOnly ? { isPublished: true } : {};

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
  });

  return NextResponse.json({ posts });
}

// POST /api/blog - Create blog post (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validated = createBlogPostSchema.parse(body);

    const post = await prisma.blogPost.create({
      data: {
        ...validated,
        publishedAt: validated.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Blog post creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
