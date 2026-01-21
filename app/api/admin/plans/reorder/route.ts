import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reorderPlansSchema } from '@/lib/validations/subscription';
import { requireAuth } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = reorderPlansSchema.parse(body);

    for (const [index, planId] of validatedData.planIds.entries()) {
      await prisma.subscriptionPlan.update({
        where: { id: planId },
        data: { displayOrder: index },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Plans reordered successfully',
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Reorder plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
