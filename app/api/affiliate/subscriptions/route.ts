export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['affiliate']);
    if (!authorized) return response!;

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');

    const affiliateId = user!.userId;

    let where: any = {
      affiliateId: affiliateId,
      payment: {
        status: 'SUCCESS'
      }
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (plan && plan !== 'ALL') {
      where.payment = {
        ...where.payment,
        subscription: {
          plan: {
            name: { contains: plan, mode: 'insensitive' }
          }
        }
      };
    }

    const commissions = await prisma.commission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lead: true,
        payment: {
          include: {
            subscription: {
              include: {
                plan: true
              }
            }
          }
        }
      }
    });

    const formattedCommissions = commissions.map(c => {
      // Logic for dates
      const purchaseDate = new Date(c.payment.createdAt);
      const refundWindowEndsAt = new Date(purchaseDate);
      refundWindowEndsAt.setDate(refundWindowEndsAt.getDate() + 14); // 14 day refund window assumed
      
      const attributionExpiresAt = new Date(c.lead.createdAt);
      attributionExpiresAt.setDate(attributionExpiresAt.getDate() + 90); // 90 day cookie attribution assumed

      // Add masking for privacy
      const maskedPhone = c.lead.mobileNumber.slice(-4).padStart(c.lead.mobileNumber.length, '*');
      const maskedLastName = c.lead.lastName ? `${c.lead.lastName[0]}.` : '';
      const customerName = `${c.lead.firstName} ${maskedLastName}`.trim();

      return {
        id: c.id,
        customerName: customerName,
        customerPhone: maskedPhone,
        leadSource: c.lead.source,
        planName: c.payment.subscription.plan.name,
        planDurationDays: c.payment.subscription.plan.durationDays,
        packageAmount: c.payment.amount,
        commissionPercentage: c.percentage,
        commissionAmount: c.amount,
        commissionStatus: c.status,
        purchaseDate: purchaseDate.toISOString(),
        refundWindowEndsAt: refundWindowEndsAt.toISOString(),
        attributionExpiresAt: attributionExpiresAt.toISOString(),
        paidAt: c.status === 'PAID' ? c.updatedAt.toISOString() : null,
        createdAt: c.createdAt.toISOString()
      };
    });

    return NextResponse.json({
      success: true,
      commissions: formattedCommissions,
    });
  } catch (error: any) {
    console.error('Affiliate subscriptions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
