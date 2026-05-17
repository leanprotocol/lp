export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { createAuditLog } from '@/services/audit-service';
import { AuditAction } from '@prisma/client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await prisma.lead.delete({
      where: { id }
    });

    // Log the action
    await createAuditLog({
      actorId: user!.userId,
      action: AuditAction.DELETED,
      targetTable: 'Lead',
      targetId: id,
      beforeState: lead,
      metadata: { note: 'Manually deleted from admin panel' }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Admin delete lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
