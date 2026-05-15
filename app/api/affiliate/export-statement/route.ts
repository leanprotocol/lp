export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['affiliate']);
    if (!authorized) return response!;

    const affiliateId = user!.userId;
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month'); // Expecting YYYY-MM
    
    let whereClause: any = { affiliateId };
    
    if (month) {
        const [year, m] = month.split('-').map(Number);
        const startDate = new Date(year, m - 1, 1);
        const endDate = new Date(year, m, 0, 23, 59, 59);
        whereClause.createdAt = {
            gte: startDate,
            lte: endDate
        };
    }

    const commissions = await prisma.commission.findMany({
      where: whereClause,
      include: {
        lead: true,
        payment: {
            include: {
                subscription: {
                    include: { plan: true }
                }
            }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Generate CSV
    const headers = ['Date', 'Customer Name', 'Phone', 'Plan', 'Amount', 'Commission %', 'Commission Earned', 'Status'];
    const rows = commissions.map(c => [
        c.createdAt.toISOString().split('T')[0],
        `${c.lead.firstName} ${c.lead.lastName || ''}`.trim(),
        c.lead.mobileNumber,
        c.payment.subscription.plan.name,
        c.payment.amount,
        `${c.percentage}%`,
        c.amount,
        c.status
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="statement-${month || 'all'}.csv"`
        }
    });

  } catch (error: any) {
    console.error('Export statement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
