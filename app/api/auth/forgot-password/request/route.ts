export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forgotPasswordRequestSchema } from '@/lib/validations/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordRequestSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { mobileNumber: validatedData.mobileNumber },
      select: { id: true, isVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this mobile number' },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Your account is not verified. Please complete registration first.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User verified. Please proceed with OTP verification using Firebase.',
      mobileNumber: validatedData.mobileNumber,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Forgot password request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
