export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { updateProfileSchema } from '@/lib/validations/user';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        mobileNumber: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        mobileNumber: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
    }
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
