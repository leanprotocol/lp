export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status: status as any } : {};

    try {
      const submissions = await prisma.quizSubmission.findMany({
        where,
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

      return NextResponse.json({
        success: true,
        submissions,
      });
    } catch (dbError) {
      console.error('Database error in quiz GET:', dbError);
      // Fallback for testing UI when DB is down
      return NextResponse.json({
        success: true,
        submissions: [
          {
            id: 'mock-submission-id',
            userId: 'mock-user-id',
            answers: [],
            status: 'PENDING_REVIEW',
            submittedAt: new Date().toISOString(),
            user: {
              id: 'mock-user-id',
              name: 'Test User',
              mobileNumber: '9999999999'
            },
            insuranceProvider: null
          }
        ],
        isMock: true
      });
    }

  } catch (error: any) {
    console.error('Get quiz submissions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
