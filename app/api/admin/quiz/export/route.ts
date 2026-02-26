export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

function normalizeAnswers(answers: any): string {
  if (answers == null) return '';

  if (Array.isArray(answers)) {
    return answers
      .map((item) => {
        if (item && typeof item === 'object') {
          const q = 'question' in item ? String(item.question ?? '') : '';
          const a = 'answer' in item ? String(item.answer ?? '') : '';
          if (q || a) return `${q}: ${a}`;
          return JSON.stringify(item);
        }
        return String(item);
      })
      .join('\n');
  }

  if (typeof answers === 'object') {
    return Object.entries(answers)
      .map(([k, v]) => `${k}: ${String(v)}`)
      .join('\n');
  }

  return String(answers);
}

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const submissions = await prisma.quizSubmission.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobileNumber: true,
          },
        },
        insuranceProvider: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Lean Healthcare Admin';

    const worksheet = workbook.addWorksheet('Quiz Submissions', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 34 },
      { header: 'Status', key: 'status', width: 16 },
      { header: 'Submitted At', key: 'submittedAt', width: 22 },
      { header: 'Reviewed At', key: 'reviewedAt', width: 22 },
      { header: 'Review Notes', key: 'reviewNotes', width: 40 },
      { header: 'Quiz Session ID', key: 'quizSessionId', width: 24 },
      { header: 'Insurance Provider', key: 'insuranceProvider', width: 24 },
      { header: 'User ID', key: 'userId', width: 34 },
      { header: 'User Name', key: 'userName', width: 22 },
      { header: 'User Mobile', key: 'userMobile', width: 16 },
      { header: 'Answers', key: 'answers', width: 80 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: worksheet.columns.length },
    };

    for (const sub of submissions) {
      worksheet.addRow({
        id: sub.id,
        status: sub.status,
        submittedAt: sub.submittedAt,
        reviewedAt: sub.reviewedAt ?? '',
        reviewNotes: sub.reviewNotes ?? '',
        quizSessionId: sub.quizSessionId ?? '',
        insuranceProvider: sub.insuranceProvider?.name ?? '',
        userId: sub.user?.id ?? '',
        userName: sub.user?.name ?? '',
        userMobile: sub.user?.mobileNumber ?? '',
        answers: normalizeAnswers(sub.answers),
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

    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `quiz-submissions-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('Export quiz submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
