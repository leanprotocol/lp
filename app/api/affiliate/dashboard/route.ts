export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['affiliate']);
    if (!authorized) return response!;

    const affiliateId = user!.userId;

    const [
      affiliate,
      leadsCount,
      convertedCount,
      commissions,
      recentConversions
    ] = await Promise.all([
      prisma.affiliate.findUnique({
        where: { id: affiliateId },
        select: { clicks: true, referralCode: true }
      }),
      prisma.lead.count({ where: { affiliateId } }),
      prisma.lead.count({ where: { affiliateId, status: 'CONVERTED' } }),
      prisma.commission.findMany({
        where: { affiliateId },
        select: { amount: true, status: true }
      }),
      prisma.commission.findMany({
        where: { affiliateId },
        include: {
            lead: {
                select: { firstName: true, lastName: true, mobileNumber: true }
            },
            payment: {
                select: { amount: true, createdAt: true, subscription: { include: { plan: { select: { name: true } } } } }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const funnel = {
      clicks: affiliate?.clicks || 0,
      leadsCount: leadsCount,
      conversions: convertedCount,
      refundWindowPending: commissions.filter(c => c.status === 'PENDING').length,
      eligible: commissions.filter(c => c.status === 'ELIGIBLE').length,
      paid: commissions.filter(c => c.status === 'PAID').length,
    };

    const conversionRate = leadsCount > 0 ? (convertedCount / leadsCount) * 100 : 0;

    const commissionsStats = {
      total: commissions.reduce((sum, c) => sum + c.amount, 0),
      pending: commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0),
      eligible: commissions.filter(c => c.status === 'ELIGIBLE').reduce((sum, c) => sum + c.amount, 0),
      paid: commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0),
    };

    // Mask PII for frontend
    const formattedRecentConversions = recentConversions.map(c => {
        const maskedPhone = c.lead.mobileNumber.slice(-4).padStart(c.lead.mobileNumber.length, '*');
        const maskedLastName = c.lead.lastName ? `${c.lead.lastName[0]}.` : '';
        
        return {
            id: c.id,
            customerName: `${c.lead.firstName} ${maskedLastName}`.trim(),
            customerPhone: maskedPhone,
            planName: c.payment.subscription.plan.name,
            packageAmount: c.payment.amount,
            commissionAmount: c.amount,
            commissionStatus: c.status,
            date: c.createdAt
        };
    });

    return NextResponse.json({
      success: true,
      funnel,
      conversionRate,
      commissions: commissionsStats,
      recentConversions: formattedRecentConversions,
      referralLink: `https://leanprotocol.in/lp/${affiliate?.referralCode || ""}`,
      referralCode: affiliate?.referralCode || ""
    });

  } catch (error: any) {
    console.error('Get affiliate dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
