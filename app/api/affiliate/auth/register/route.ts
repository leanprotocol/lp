export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { affiliateRegisterSchema } from '@/lib/validations/auth';
import { signJWT } from '@/lib/auth/jwt';
import { setAffiliateAuthCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = affiliateRegisterSchema.parse(body);

    const normalizedEmail = validatedData.email.toLowerCase();

    // Check if affiliate already exists
    const existingAffiliate = await prisma.affiliate.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { mobileNumber: validatedData.mobileNumber },
          { referralCode: validatedData.referralCode }
        ]
      }
    });

    if (existingAffiliate) {
      let field = 'email';
      if (existingAffiliate.mobileNumber === validatedData.mobileNumber) field = 'mobile number';
      if (existingAffiliate.referralCode === validatedData.referralCode) field = 'referral code';
      
      return NextResponse.json(
        { error: `Affiliate with this ${field} already exists` },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const affiliate = await prisma.affiliate.create({
      data: {
        name: validatedData.name,
        email: normalizedEmail,
        mobileNumber: validatedData.mobileNumber,
        referralCode: validatedData.referralCode,
        password: hashedPassword,
        isVerified: false,
        isActive: true,
      },
    });

    const token = await signJWT({
      userId: affiliate.id,
      type: 'affiliate' as any, // 'affiliate' type needs to be handled in JWTPayload if strictly typed
      email: affiliate.email,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Affiliate registration successful',
      affiliate: {
        id: affiliate.id,
        email: affiliate.email,
        name: affiliate.name,
        mobileNumber: affiliate.mobileNumber,
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

    console.error('Affiliate registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
