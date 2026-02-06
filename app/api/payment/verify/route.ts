export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPaymentSchema } from '@/lib/validations/payment';
import { requireAuth } from '@/lib/auth/middleware';
import { verifyJWT } from '@/lib/auth/jwt';
import { razorpayService } from '@/services/payment/razorpay.service';

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

    const body = await request.json();
    const validatedData = verifyPaymentSchema.parse(body);

    const verificationResult = razorpayService.verifyPaymentSignature(
      validatedData.razorpayOrderId,
      validatedData.razorpayPaymentId,
      validatedData.razorpaySignature
    );

    if (!verificationResult.success) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: validatedData.razorpayOrderId },
      include: { subscription: { include: { plan: true } } },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.userId !== resolvedUser.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (payment.status === 'SUCCESS') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        subscriptionId: payment.subscriptionId,
      });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: validatedData.razorpayPaymentId,
        razorpaySignature: validatedData.razorpaySignature,
        status: 'SUCCESS',
        failureReason: null,
        metadata: {
          ...(typeof payment.metadata === 'object' && payment.metadata ? (payment.metadata as any) : {}),
          verifiedAt: new Date().toISOString(),
          verifiedVia: 'client',
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment successful. Your subscription is pending admin approval.',
      subscriptionId: payment.subscriptionId,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
