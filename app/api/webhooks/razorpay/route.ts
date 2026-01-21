export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { razorpayService } from '@/services/payment/razorpay.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const isValid = razorpayService.verifyWebhookSignature(body, signature);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: paymentEntity.order_id },
        include: { subscription: true },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: paymentEntity.id,
            status: 'SUCCESS',
          },
        });
      }
    } else if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: paymentEntity.order_id },
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: paymentEntity.error_description || 'Payment failed',
          },
        });

        await prisma.subscription.update({
          where: { id: payment.subscriptionId },
          data: { status: 'REJECTED' },
        });
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
