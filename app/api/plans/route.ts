  export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({
      success: true,
      plans: plans.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        durationDays: plan.durationDays,
        features: plan.features,
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
