export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const contactQueries = await prisma.contactQuery.findMany({
      include: {
        user: {
          select: {
            id: true,
            mobileNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      contactQueries,
    });

  } catch (error: any) {
    console.error('Get contact queries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
