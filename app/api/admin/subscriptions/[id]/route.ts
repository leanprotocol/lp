import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviewSubscriptionSchema } from '@/lib/validations/subscription';
import { requireAuth } from '@/lib/auth/middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized || !user) return response!;

    const body = await request.json();
    const validatedData = reviewSubscriptionSchema.parse(body);

    const { id } = await params;

    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const updateData: any = {
      status: validatedData.status,
      approvedBy: user.userId,
    };

    if (validatedData.status === 'APPROVED') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + subscription.plan.durationDays);

      updateData.startDate = startDate;
      updateData.endDate = endDate;
      updateData.status = 'ACTIVE';
    } else if (validatedData.status === 'REJECTED') {
      updateData.rejectionReason = validatedData.rejectionReason;
    } else if (validatedData.status === 'CANCELLED' || validatedData.status === 'REFUNDED') {
      updateData.endDate = new Date();
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Subscription ${validatedData.status.toLowerCase()} successfully`,
      subscription: updatedSubscription,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Review subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
