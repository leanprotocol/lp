export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.userId,
        status: { in: ['ACTIVE', 'PENDING_APPROVAL'] },
      },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
      });
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        autoRenew: subscription.autoRenew,
        plan: {
          name: subscription.plan.name,
          description: subscription.plan.description,
          price: subscription.plan.price,
          durationDays: subscription.plan.durationDays,
          features: subscription.plan.features,
          isRefundable: subscription.plan.isRefundable,
        },
        payment: subscription.payments[0] ? {
          amount: subscription.payments[0].amount,
          status: subscription.payments[0].status,
          createdAt: subscription.payments[0].createdAt,
        } : null,
      },
    });

  } catch (error: any) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
