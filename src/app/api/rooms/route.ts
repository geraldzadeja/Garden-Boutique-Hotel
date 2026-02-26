import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createRoomSchema } from '@/lib/validators/room';
import { z } from 'zod';

// GET /api/rooms - List rooms (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('activeOnly') === 'true';

  const where = activeOnly ? { isActive: true } : {};

  const rooms = await prisma.room.findMany({
    where,
    orderBy: { displayOrder: 'asc' },
  });

  return NextResponse.json({ rooms });
}

// POST /api/rooms - Create room (admin only)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const validated = createRoomSchema.parse(body);

    const room = await prisma.room.create({
      data: validated,
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Room creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
