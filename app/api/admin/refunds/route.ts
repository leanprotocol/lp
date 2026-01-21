export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as any } : {};

    const refundRequests = await prisma.refundRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            mobileNumber: true,
          },
        },
        subscription: {
          include: {
            plan: true,
            payments: {
              where: { status: 'SUCCESS' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      refundRequests,
    });

  } catch (error: any) {
    console.error('Get refund requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
