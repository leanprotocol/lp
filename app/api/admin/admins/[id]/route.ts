import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth/password';

const updateAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  isActive: z.boolean().optional(),
});

// PUT - Update admin
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateAdminSchema.parse(body);

    const existing = await prisma.admin.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (user?.userId === id && validatedData.isActive === false) {
      return NextResponse.json(
        { error: 'You cannot disable your own admin account' },
        { status: 400 }
      );
    }

    if (validatedData.isActive === false && existing.isActive) {
      const activeAdminCount = await prisma.admin.count({ where: { isActive: true } });
      if (activeAdminCount <= 1) {
        return NextResponse.json(
          { error: 'You cannot deactivate the last active admin account' },
          { status: 400 }
        );
      }
    }

    const dataToUpdate: Record<string, any> = { ...validatedData };
    dataToUpdate.role = 'admin';

    if (validatedData.password) {
      dataToUpdate.password = await hashPassword(validatedData.password);
    } else {
      delete dataToUpdate.password;
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, admin: updated });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove admin
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { id } = await params;

    if (user?.userId === id) {
      return NextResponse.json(
        { error: 'You cannot delete your own admin account' },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    if (existing.isActive) {
      const activeAdminCount = await prisma.admin.count({ where: { isActive: true } });
      if (activeAdminCount <= 1) {
        return NextResponse.json(
          { error: 'You cannot delete the last active admin account' },
          { status: 400 }
        );
      }
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
