export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const [
      totalUsers,
      verifiedUsers,
      totalSubmissions,
      pendingSubmissions,
      totalPlans,
      activePlans,
      totalSubscriptions,
      activeSubscriptions,
      totalPayments,
      totalRevenue,
      totalRefunds,
      pendingRefunds,
      totalQueries,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.quizSubmission.count(),
      prisma.quizSubmission.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.subscriptionPlan.count(),
      prisma.subscriptionPlan.count({ where: { isActive: true } }),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.payment.count(),
      prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      prisma.refundRequest.count(),
      prisma.refundRequest.count({ where: { status: 'PENDING' } }),
      prisma.contactQuery.count(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
        },
        submissions: {
          total: totalSubmissions,
          pending: pendingSubmissions,
        },
        plans: {
          total: totalPlans,
          active: activePlans,
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
        },
        payments: {
          total: totalPayments,
          revenue: totalRevenue._sum.amount || 0,
        },
        refunds: {
          total: totalRefunds,
          pending: pendingRefunds,
        },
        queries: {
          total: totalQueries,
        },
      },
    });

  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
