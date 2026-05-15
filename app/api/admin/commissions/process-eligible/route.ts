export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CommissionStatus } from '@prisma/client';
import { createAuditLog } from '@/services/audit-service';
import { AuditAction } from '@prisma/client';

/**
 * Endpoint to be called by a cron job to transition pending commissions to eligible.
 * Recommended frequency: Once every 24 hours.
 */
export async function GET(request: NextRequest) {
  try {
    // Basic security: check for a cron secret if provided in environment
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    // Find commissions that have passed their 28-day refund window
    const eligibleCommissions = await prisma.commission.updateMany({
      where: {
        status: CommissionStatus.PENDING,
        eligibleAt: { lte: now }
      },
      data: {
        status: CommissionStatus.ELIGIBLE
      }
    });

    if (eligibleCommissions.count > 0) {
      // Log the automated action (actorId is null for system actions)
      await createAuditLog({
        action: AuditAction.COMMISSION_CHANGED,
        targetTable: 'Commission',
        targetId: 'SYSTEM_CRON',
        metadata: { 
            count: eligibleCommissions.count,
            message: 'Automated eligibility transition'
        }
      });
    }

    return NextResponse.json({
      success: true,
      processed: eligibleCommissions.count,
      timestamp: now.toISOString()
    });

  } catch (error: any) {
    console.error('Process eligible commissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
