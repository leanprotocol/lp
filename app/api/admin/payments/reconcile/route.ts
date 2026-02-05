export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { razorpayService } from '@/services/payment/razorpay.service';

function normalizeRazorpayPaymentStatus(status?: string | null) {
  // Razorpay payment statuses are typically: created, authorized, captured, failed, refunded
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === 'captured') return 'SUCCESS';
  if (s === 'failed') return 'FAILED';
  return 'PROCESSING';
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const url = new URL(request.url);
    const olderThanMinutes = Number(url.searchParams.get('olderThanMinutes') ?? '10');

    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);

    const candidates = await prisma.payment.findMany({
      where: {
        status: 'PROCESSING',
        createdAt: { lte: cutoff },
      },
      include: { subscription: true },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    const results: Array<{
      razorpayOrderId: string;
      paymentId: string;
      action: 'unchanged' | 'marked_success' | 'marked_failed' | 'skipped';
      reason?: string;
    }> = [];

    for (const payment of candidates) {
      try {
        // If already updated by another worker between query and now
        if (payment.status !== 'PROCESSING') {
          results.push({
            razorpayOrderId: payment.razorpayOrderId,
            paymentId: payment.id,
            action: 'skipped',
            reason: 'Already processed',
          });
          continue;
        }

        const orderPayments = await razorpayService.fetchOrderPayments(payment.razorpayOrderId);
        const items = (orderPayments as any)?.items as Array<any> | undefined;

        const best = Array.isArray(items)
          ? (items.find((p) => (p?.status ?? '').toLowerCase() === 'captured') ??
              items.find((p) => (p?.status ?? '').toLowerCase() === 'failed') ??
              items[0])
          : null;

        const mapped = normalizeRazorpayPaymentStatus(best?.status);

        if (mapped === 'SUCCESS') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESS',
              razorpayPaymentId: best?.id ?? payment.razorpayPaymentId,
              failureReason: null,
              metadata: {
                ...(typeof payment.metadata === 'object' && payment.metadata ? (payment.metadata as any) : {}),
                reconciledAt: new Date().toISOString(),
                reconciledVia: 'admin',
                razorpay: {
                  paymentStatus: best?.status,
                },
              },
            },
          });
          results.push({
            razorpayOrderId: payment.razorpayOrderId,
            paymentId: payment.id,
            action: 'marked_success',
          });
        } else if (mapped === 'FAILED') {
          await prisma.$transaction(async (tx) => {
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: 'FAILED',
                razorpayPaymentId: best?.id ?? payment.razorpayPaymentId,
                failureReason: best?.error_description ?? 'Payment failed',
                metadata: {
                  ...(typeof payment.metadata === 'object' && payment.metadata ? (payment.metadata as any) : {}),
                  reconciledAt: new Date().toISOString(),
                  reconciledVia: 'admin',
                  razorpay: {
                    paymentStatus: best?.status,
                  },
                },
              },
            });

            await tx.subscription.update({
              where: { id: payment.subscriptionId },
              data: {
                status: 'REJECTED',
                rejectionReason: 'Payment failed',
              },
            });
          });

          results.push({
            razorpayOrderId: payment.razorpayOrderId,
            paymentId: payment.id,
            action: 'marked_failed',
          });
        } else {
          results.push({
            razorpayOrderId: payment.razorpayOrderId,
            paymentId: payment.id,
            action: 'unchanged',
            reason: 'No captured/failed payment found for order yet',
          });
        }
      } catch (error: any) {
        results.push({
          razorpayOrderId: payment.razorpayOrderId,
          paymentId: payment.id,
          action: 'unchanged',
          reason: error?.message || 'Reconciliation error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      cutoff,
      processed: candidates.length,
      results,
    });
  } catch (error: any) {
    console.error('Reconcile payments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
