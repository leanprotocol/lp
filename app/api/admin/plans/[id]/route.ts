import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updatePlanSchema } from '@/lib/validations/subscription';
import { requireAuth } from '@/lib/auth/middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = updatePlanSchema.parse(body);

    const { id } = await params;

    const plan = await prisma.$transaction(async (tx) => {
      if (validatedData.isDefault === true) {
        await tx.subscriptionPlan.updateMany({
          where: { id: { not: id }, isDefault: true } as any,
          data: { isDefault: false } as any,
        });
      }

      return tx.subscriptionPlan.update({
        where: { id },
        data: validatedData,
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Plan updated successfully',
      plan,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { id } = await params;

    await prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Plan disabled successfully',
    });

  } catch (error: any) {
    console.error('Delete plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
