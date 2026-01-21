export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toggleAutoRenewSchema } from '@/lib/validations/subscription';
import { requireAuth } from '@/lib/auth/middleware';

export async function PATCH(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const body = await request.json();
    const validatedData = toggleAutoRenewSchema.parse(body);

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.userId,
        status: 'ACTIVE',
      },
      include: { plan: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    if (!subscription.plan.allowAutoRenew) {
      return NextResponse.json(
        { error: 'Auto-renew is not available for this plan' },
        { status: 400 }
      );
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { autoRenew: validatedData.autoRenew },
    });

    return NextResponse.json({
      success: true,
      message: `Auto-renew ${validatedData.autoRenew ? 'enabled' : 'disabled'} successfully`,
      autoRenew: updatedSubscription.autoRenew,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Toggle auto-renew error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
