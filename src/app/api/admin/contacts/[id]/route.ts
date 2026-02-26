import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/contacts/:id - Update message (mark read/unread)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (typeof body.isRead === 'boolean') {
      updateData.isRead = body.isRead;
    }
    if (body.respondedAt !== undefined) {
      updateData.respondedAt = body.respondedAt ? new Date(body.respondedAt) : null;
    }

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error updating contact message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/contacts/:id - Delete message (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    await prisma.contactMessage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
