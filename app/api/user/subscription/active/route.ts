export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const optional = new URL(request.url).searchParams.get('optional') === '1';

    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) {
      if (optional) {
        return NextResponse.json({ success: true, subscription: null }, { status: 200 });
      }
      return response!;
    }

    const subscription = (await prisma.subscription.findFirst({
      where: {
        userId: user.userId,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
      include: {
        plan: true,
      } as any,
      orderBy: { createdAt: 'desc' },
    })) as any;

    return NextResponse.json({
      success: true,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            autoRenew: subscription.autoRenew,
            plan: subscription.plan,
          }
        : null,
    });
  } catch (error: any) {
    console.error('Get active subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
