export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPlanSchema } from '@/lib/validations/subscription';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const columns = (await prisma.$queryRaw<
      Array<{ column_name: string }>
    >`SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'SubscriptionPlan'`) as Array<{ column_name: string }>;

    const hasDisplayOrder = columns.some((c) => c.column_name === 'displayOrder');
    if (!hasDisplayOrder) {
      return NextResponse.json(
        {
          error:
            'Database schema is out of date: missing SubscriptionPlan.displayOrder. Ensure your app runtime DATABASE_URL matches the DB you migrated, then run `npx prisma migrate deploy` (or `npx prisma migrate dev`) and restart the dev server.',
        },
        { status: 500 },
      );
    }

    let plans;
    try {
      plans = await prisma.subscriptionPlan.findMany({
        orderBy: { displayOrder: 'asc' },
      });
    } catch (error: any) {
      if (error?.code === 'P2022') {
        return NextResponse.json(
          {
            error:
              'Prisma reported a missing column, but displayOrder exists. This is typically caused by a stale generated Prisma Client / stale Next dev server build. Run `npx prisma generate`, then restart `npm run dev` (and if needed delete `.next`).',
          },
          { status: 500 },
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      plans,
    });

  } catch (error: any) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = createPlanSchema.parse(body);

    const plan = await prisma.$transaction(async (tx) => {
      if ((validatedData as any).isDefault === true) {
        await tx.subscriptionPlan.updateMany({
          where: { isDefault: true } as any,
          data: { isDefault: false } as any,
        });
      }

      return tx.subscriptionPlan.create({
        data: validatedData as any,
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Plan created successfully',
      plan,
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create plan error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
