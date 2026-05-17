export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['affiliate']);
    if (!authorized) return response!;

    // Affiliates only see active plans they can promote
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      plans,
    });
  } catch (error: any) {
    console.error('Get affiliate plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
