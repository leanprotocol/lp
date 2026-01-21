import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviewRefundSchema } from '@/lib/validations/refund';
import { requireAuth } from '@/lib/auth/middleware';
import { razorpayService } from '@/services/payment/razorpay.service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = reviewRefundSchema.parse(body);

    const refundRequest = await prisma.refundRequest.findUnique({
      where: { id: params.id },
      include: {
        subscription: {
          include: {
            payments: {
              where: { status: 'SUCCESS' },
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!refundRequest) {
      return NextResponse.json(
        { error: 'Refund request not found' },
        { status: 404 }
      );
    }

    if (refundRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Refund request already processed' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status: validatedData.status,
      adminNotes: validatedData.adminNotes,
      processedAt: new Date(),
    };

    if (validatedData.status === 'APPROVED') {
      const payment = refundRequest.subscription.payments[0];
      
      if (!payment || !payment.razorpayPaymentId) {
        return NextResponse.json(
          { error: 'No successful payment found for this subscription' },
          { status: 400 }
        );
      }

      const refundResult = await razorpayService.createRefund(
        payment.razorpayPaymentId,
        payment.amount
      );

      if (!refundResult.success) {
        return NextResponse.json(
          { error: refundResult.error || 'Failed to process refund' },
          { status: 500 }
        );
      }

      updateData.refundAmount = payment.amount;
      updateData.razorpayRefundId = refundResult.refundId;

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'REFUNDED' },
      });

      await prisma.subscription.update({
        where: { id: refundRequest.subscriptionId },
        data: { status: 'EXPIRED' },
      });
    }

    const updatedRefund = await prisma.refundRequest.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Refund request ${validatedData.status.toLowerCase()} successfully`,
      refundRequest: updatedRefund,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Process refund error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
