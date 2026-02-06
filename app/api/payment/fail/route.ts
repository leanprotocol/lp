export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { verifyJWT } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['user']);
    let resolvedUser = user;

    if (!authorized || !resolvedUser) {
      const tempToken = request.cookies.get('temp-auth-token')?.value;
      if (!tempToken) return response!;

      const decoded = await verifyJWT(tempToken);
      if (decoded.type !== 'user') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      resolvedUser = decoded;
    }

    const body = (await request.json()) as {
      razorpayOrderId?: string;
      failureReason?: string;
      metadata?: any;
    };

    const razorpayOrderId = body?.razorpayOrderId;
    if (!razorpayOrderId) {
      return NextResponse.json({ error: 'razorpayOrderId is required' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId },
      include: { subscription: true },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (payment.userId !== resolvedUser.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (payment.status === 'SUCCESS') {
      return NextResponse.json({
        success: true,
        message: 'Payment already marked as SUCCESS.',
        paymentId: payment.id,
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failureReason: body?.failureReason ?? payment.failureReason ?? null,
          metadata: {
            ...(typeof payment.metadata === 'object' && payment.metadata ? (payment.metadata as any) : {}),
            ...(typeof body?.metadata === 'object' && body?.metadata ? body.metadata : {}),
            failedAt: new Date().toISOString(),
            failedVia: 'client',
          },
        },
      });

      if (payment.subscription?.status === 'PENDING_APPROVAL') {
        await tx.subscription.update({
          where: { id: payment.subscriptionId },
          data: { status: 'CANCELLED' },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment marked as FAILED.',
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Payment fail update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
