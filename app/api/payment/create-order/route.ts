export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderSchema } from '@/lib/validations/payment';
import { requireAuth } from '@/lib/auth/middleware';
import { razorpayService } from '@/services/payment/razorpay.service';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) return response!;

    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: validatedData.planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Invalid or inactive plan' },
        { status: 404 }
      );
    }

    const blockingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.userId,
        status: { in: ['ACTIVE', 'PENDING_APPROVAL'] },
      },
      include: {
        plan: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (blockingSubscription && !plan.allowMultiplePurchase) {
      return NextResponse.json(
        {
          error:
            blockingSubscription.status === 'PENDING_APPROVAL'
              ? 'You already have a subscription pending admin approval.'
              : 'You already have an active subscription.',
          blockingSubscription: {
            id: blockingSubscription.id,
            status: blockingSubscription.status,
            planName: blockingSubscription.plan?.name ?? null,
            endDate: blockingSubscription.endDate,
          },
        },
        { status: 400 }
      );
    }

    const orderResult = await razorpayService.createOrder(
      plan.price,
      'INR',
      {
        userId: user.userId,
        planId: plan.id,
      }
    );

    if (!orderResult.success) {
      return NextResponse.json(
        { error: orderResult.error || 'Failed to create order' },
        { status: 500 }
      );
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId: user.userId,
        planId: plan.id,
        status: 'PENDING_APPROVAL',
      },
    });

    const payment = await prisma.payment.create({
      data: {
        userId: user.userId,
        subscriptionId: subscription.id,
        razorpayOrderId: orderResult.orderId!,
        amount: plan.price,
        currency: 'INR',
        status: 'PROCESSING',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: orderResult.orderId,
      amount: orderResult.amount,
      currency: orderResult.currency,
      keyId: env.RAZORPAY_KEY_ID,
      subscriptionId: subscription.id,
      paymentId: payment.id,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
