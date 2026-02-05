  export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: [{ isDefault: 'desc' }, { displayOrder: 'asc' }] as any,
    });

    return NextResponse.json({
      success: true,
      plans: plans.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        originalPrice: plan.originalPrice,
        durationDays: plan.durationDays,
        features: plan.features,
        isDefault: plan.isDefault,
        isRefundable: plan.isRefundable,
        allowAutoRenew: plan.allowAutoRenew,
      })),
    });

  } catch (error: any) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
