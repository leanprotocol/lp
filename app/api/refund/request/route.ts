export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRefundRequestSchema } from '@/lib/validations/refund';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const body = await request.json();
    const validatedData = createRefundRequestSchema.parse(body);

    const subscription = await prisma.subscription.findUnique({
      where: { id: validatedData.subscriptionId },
      include: { 
        plan: true,
        payments: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (subscription.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (!subscription.plan.isRefundable) {
      return NextResponse.json(
        { error: 'This subscription plan is not refundable' },
        { status: 400 }
      );
    }

    const existingRefund = await prisma.refundRequest.findFirst({
      where: { subscriptionId: subscription.id },
    });

    if (existingRefund) {
      return NextResponse.json(
        { error: 'Refund request already exists for this subscription' },
        { status: 400 }
      );
    }

    const refundRequest = await prisma.refundRequest.create({
      data: {
        userId: user.userId,
        subscriptionId: subscription.id,
        reason: validatedData.reason,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Refund request submitted successfully. It will be reviewed by admin.',
      refundRequestId: refundRequest.id,
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Refund request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
