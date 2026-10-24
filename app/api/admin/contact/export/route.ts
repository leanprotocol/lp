export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { logExport, parseRange, provenanceLine, requireReason } from '@/lib/admin/export-guard';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response, user } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const url = request.nextUrl;
    const asked = requireReason(url);
    if ('error' in asked) return asked.error;
    const range = parseRange(url);
    const actorId = (user as { userId?: string } | undefined)?.userId;

    const contactQueries = await prisma.contactQuery.findMany({
      include: {
        user: {
          select: {
            id: true,
            mobileNumber: true,
            name: true,
          },
        },
      },
      where: range.from || range.to
        ? { createdAt: { ...(range.from ? { gte: range.from } : {}), ...(range.to ? { lte: range.to } : {}) } }
        : {},
      orderBy: { createdAt: 'desc' },
    });

    await logExport({
      actorId,
      kind: 'contactQueries',
      rows: contactQueries.length,
      reason: asked.reason,
      range: range.label,
      containsHealthData: false,
    });

    const workbook = new ExcelJS.Workbook();
    workbook.affiliate = 'Lean Healthcare Admin';

    const worksheet = workbook.addWorksheet('Contact Queries', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 34 },
      { header: 'Name', key: 'name', width: 22 },
      { header: 'Mobile Number', key: 'mobileNumber', width: 16 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Message', key: 'message', width: 60 },
      { header: 'Created At', key: 'createdAt', width: 22 },
      { header: 'Is Registered User', key: 'isRegisteredUser', width: 18 },
      { header: 'User ID', key: 'userId', width: 34 },
      { header: 'User Mobile', key: 'userMobile', width: 16 },
      { header: 'User Name', key: 'userName', width: 22 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length },
    };

    for (const q of contactQueries) {
      worksheet.addRow({
        id: q.id,
        name: q.name,
        mobileNumber: q.mobileNumber,
        email: q.email ?? '',
        message: q.message,
        createdAt: q.createdAt,
        isRegisteredUser: q.user ? 'Yes' : 'No',
        userId: q.user?.id ?? '',
        userMobile: q.user?.mobileNumber ?? '',
        userName: q.user?.name ?? '',
      });
    }

    worksheet.eachRow((row: ExcelJS.Row, rowNumber: number) => {
      row.alignment = {
        vertical: 'top',
        wrapText: true,
      };
      if (rowNumber === 1) {
        row.alignment = { vertical: 'middle' };
      }
    });

    const note = worksheet.addRow({});
    note.getCell(1).value = provenanceLine(actorId || 'unknown admin', asked.reason, range.label);
    note.font = { italic: true, size: 9 };

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `contact-queries-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('Export contact queries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}