export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { id } = await params;

    const affiliate = await prisma.affiliate.findUnique({
      where: { id },
      include: {
        leads: {
          orderBy: { createdAt: 'desc' },
          include: {
            commissions: {
              select: { amount: true, status: true, eligibleAt: true, paidAt: true }
            }
          }
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
          include: {
            payment: {
              select: { amount: true, razorpayPaymentId: true, createdAt: true }
            },
            lead: {
              select: { firstName: true, lastName: true, mobileNumber: true }
            }
          }
        },
        _count: { select: { leads: true, commissions: true } }
      }
    });

    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 });
    }

    // Aggregate commission stats
    let gross = 0, net = 0, pending = 0, eligible = 0, paid = 0;
    affiliate.commissions.forEach(c => {
      gross += c.payment.amount;
      net += c.amount;
      if (c.status === 'PENDING') pending += c.amount;
      if (c.status === 'ELIGIBLE') eligible += c.amount;
      if (c.status === 'PAID') paid += c.amount;
    });

    const { password: _password, ...safeAffiliate } = affiliate;

    return NextResponse.json({
      success: true,
      affiliate: {
        ...safeAffiliate,
        stats: { gross, net, pending, eligible, paid, unsettled: pending + eligible }
      }
    });

  } catch (error: any) {
    console.error('Admin get affiliate detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
