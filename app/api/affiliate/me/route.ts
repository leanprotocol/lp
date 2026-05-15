export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['affiliate']);
    if (!authorized) return response!;

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        mobileNumber: true,
        isVerified: true,
        isActive: true,
      },
    });

    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      affiliate,
    });
  } catch (error: any) {
    console.error('Get affiliate profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
