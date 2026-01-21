export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { loginSchema } from '@/lib/validations/auth';
import { signJWT } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { mobileNumber: validatedData.mobileNumber },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your mobile number before logging in' },
        { status: 403 }
      );
    }

    const isValidPassword = await verifyPassword(validatedData.password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      );
    }

    const token = await signJWT({
      userId: user.id,
      type: 'user',
      mobileNumber: user.mobileNumber,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        isVerified: user.isVerified,
      },
    });

    setAuthCookie(response, token);

    return response;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
