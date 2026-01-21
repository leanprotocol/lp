export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkRegistrationSchema = z.object({
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mobileNumber } = checkRegistrationSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { mobileNumber },
      select: { id: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        isVerified: false,
        hasQuizSubmission: false,
      });
    }

    const existingSubmission = await prisma.quizSubmission.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });

    const hasQuizSubmission = Boolean(existingSubmission);

    return NextResponse.json({
      exists: true,
      isVerified: user.isVerified,
      hasQuizSubmission,
      message: hasQuizSubmission
        ? 'You are already registered and have submitted the quiz. Verify OTP to update it.'
        : 'You are already registered. Verify OTP to continue.',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Check registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
