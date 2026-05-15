export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['affiliate']);
    if (!authorized) return response!;

    const affiliateId = user!.userId;

    const payments = await prisma.payment.findMany({
      where: {
        commission: {
          affiliateId: affiliateId
        },
        status: 'SUCCESS'
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, mobileNumber: true } },
        subscription: { include: { plan: { select: { name: true } } } },
        commission: { select: { amount: true, status: true } }
      }
    });

    let totalGross = 0;
    let totalNet = 0;
    let totalPlatform = 0;
    let unsettled = 0;

    const formattedPayments = payments.map(p => {
      totalGross += p.amount;
      const earnings = p.commission?.amount || 0;
      totalNet += earnings;
      totalPlatform += p.platformFee || 0;
      
      const isSettledToAffiliate = p.commission?.status === 'PAID';
      if (!isSettledToAffiliate) {
        unsettled += earnings;
      }

      return {
        id: p.id,
        amount: p.amount,
        platformFee: p.platformFee,
        affiliateEarnings: earnings,
        settlementStatus: isSettledToAffiliate ? 'SETTLED' : 'UNSETTLED',
        createdAt: p.createdAt,
        user: {
          name: p.user.name,
          mobileNumber: p.user.mobileNumber,
        },
        subscription: {
          plan: {
            name: p.subscription.plan.name
          }
        }
      };
    });

    return NextResponse.json({
      success: true,
      payments: formattedPayments,
      summary: {
        totalGross,
        totalNet,
        totalPlatform,
        unsettled
      }
    });
  } catch (error: any) {
    console.error('Affiliate earnings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
