export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { createAuditLog } from '@/services/audit-service';
import { AuditAction } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { id: affiliateId } = await params;

    // Mark all PENDING and ELIGIBLE commissions for this affiliate as PAID
    const result = await prisma.commission.updateMany({
      where: {
        affiliateId: affiliateId,
        status: { in: ['PENDING', 'ELIGIBLE'] }
      },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      }
    });

    // Log the action
    await createAuditLog({
      actorId: user!.userId,
      action: AuditAction.MARKED_PAID,
      targetTable: 'Commission',
      targetId: affiliateId, // Grouping by affiliateId in this case
      metadata: { count: result.count }
    });

    return NextResponse.json({
      success: true,
      message: `Successfully marked ${result.count} commissions as paid`,
      count: result.count,
    });

  } catch (error: any) {
    console.error('Admin settle affiliate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
