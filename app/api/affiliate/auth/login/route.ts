export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { affiliateLoginSchema } from '@/lib/validations/auth';
import { signJWT } from '@/lib/auth/jwt';
import { setAffiliateAuthCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = affiliateLoginSchema.parse(body);

    const normalizedEmail = validatedData.email.toLowerCase();

    const affiliate = await prisma.affiliate.findUnique({
      where: { email: normalizedEmail },
    });

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(validatedData.password, affiliate.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJWT({
      userId: affiliate.id,
      type: 'affiliate' as any,
      email: affiliate.email,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Affiliate login successful',
      affiliate: {
        id: affiliate.id,
        email: affiliate.email,
        name: affiliate.name,
        isActive: affiliate.isActive,
      },
    });

    setAffiliateAuthCookie(response, token);

    return response;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Affiliate login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
