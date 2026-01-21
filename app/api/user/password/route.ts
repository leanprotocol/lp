export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { updatePasswordSchema } from '@/lib/validations/user';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const body = await request.json();
    const { currentPassword, newPassword } = updatePasswordSchema.parse(body);

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { password: true },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.userId },
      data: { password: hashedNewPassword },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Update password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
