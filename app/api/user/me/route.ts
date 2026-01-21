export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const optional = new URL(request.url).searchParams.get('optional') === '1';

    const { authorized, user, response } = await requireAuth(request, ['user']);
    if (!authorized || !user) {
      if (optional) {
        return NextResponse.json({ success: false, user: null }, { status: 200 });
      }
      return response!;
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        mobileNumber: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Derive initials from name if present; otherwise fallback to last 4 digits of mobile
    const displayName = userData.name || userData.mobileNumber;
    const initials = userData.name
      ? userData.name
          .split(' ')
          .map(n => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : userData.mobileNumber
          .replace(/\D/g, '')
          .slice(-4)
          .split('')
          .slice(0, 2)
          .join('')
          .toUpperCase();

    const quizSubmission = await prisma.quizSubmission.findFirst({
      where: { userId: user.userId },
      orderBy: { submittedAt: 'desc' },
    });

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.userId,
        status: 'ACTIVE',
        endDate: { gt: new Date() },
      },
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        displayName,
        initials,
      },
      quizStatus: quizSubmission?.status || null,
      activeSubscription: activeSubscription ? {
        id: activeSubscription.id,
        planName: activeSubscription.plan.name,
        startDate: activeSubscription.startDate,
        endDate: activeSubscription.endDate,
        autoRenew: activeSubscription.autoRenew,
      } : null,
    });

  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
