export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { razorpayService } from '@/services/payment/razorpay.service';
import { calculateAndCreateCommission } from '@/services/commission-service';
import { CommissionStatus, LeadStatus, PaymentStatus } from '@prisma/client';

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

      if (payment && payment.status !== 'SUCCESS') {
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: paymentEntity.id,
            status: 'SUCCESS',
            failureReason: null,
            metadata: {
              ...(typeof payment.metadata === 'object' && payment.metadata ? (payment.metadata as any) : {}),
              capturedAt: new Date().toISOString(),
              capturedVia: 'webhook',
            },
          },
        });

        // Auto-activate subscription (safety net in case client-side verify did not run)
        if (payment.subscription.status !== 'ACTIVE') {
          const planData = await prisma.subscriptionPlan.findUnique({
            where: { id: payment.subscription.planId },
          });
          if (planData) {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + planData.durationDays);
            await prisma.subscription.update({
              where: { id: payment.subscription.id },
              data: { status: 'ACTIVE', startDate, endDate, approvedBy: 'system' },
            });
          }
        }

        // Calculate commission for affiliates
        await calculateAndCreateCommission(updatedPayment.id).catch(err => {
            console.error('Failed to calculate commission in webhook:', err);
        });
      }
    } else if (event.event === 'payment.failed') {
      const paymentEntity = event.payload.payment.entity;
      
      const payment = await prisma.payment.findUnique({
        where: { razorpayOrderId: paymentEntity.order_id },
      });

      if (payment && payment.status !== 'SUCCESS') {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: paymentEntity.id ?? payment.razorpayPaymentId,
            status: 'FAILED',
            failureReason: paymentEntity.error_description || 'Payment failed',
            metadata: {
              ...(typeof payment.metadata === 'object' && payment.metadata ? (payment.metadata as any) : {}),
              failedAt: new Date().toISOString(),
              failedVia: 'webhook',
              error: {
                code: paymentEntity.error_code,
                description: paymentEntity.error_description,
                source: paymentEntity.error_source,
                step: paymentEntity.error_step,
                reason: paymentEntity.error_reason,
              },
            },
          },
        });

        await prisma.subscription.update({
          where: { id: payment.subscriptionId },
          data: { status: 'REJECTED', rejectionReason: 'Payment failed' },
        });
      }
    } else if (event.event === 'refund.processed') {
      const refundEntity = event.payload.refund.entity;
      const paymentId = refundEntity.payment_id;

      // Find the payment by razorpayPaymentId
      const payment = await prisma.payment.findUnique({
        where: { razorpayPaymentId: paymentId },
        include: { commission: true, user: true }
      });

      if (payment) {
        // 1. Update Payment status
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.REFUNDED }
        });

        // 2. Cancel Commission
        if (payment.commission) {
          await prisma.commission.update({
            where: { id: payment.commission.id },
            data: { status: CommissionStatus.CANCELLED }
          });
        }

        // 3. Update Lead status
        const lead = await prisma.lead.findFirst({
          where: {
            mobileNumber: payment.user.mobileNumber,
            status: LeadStatus.CONVERTED
          },
          orderBy: { convertedAt: 'desc' }
        });

        if (lead) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { status: LeadStatus.REFUNDED }
          });
        }
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
