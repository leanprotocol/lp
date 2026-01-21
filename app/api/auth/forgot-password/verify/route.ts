import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forgotPasswordVerifySchema } from '@/lib/validations/auth';
import { verifyFirebaseIdToken } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordVerifySchema.parse(body);

    const decodedToken = await verifyFirebaseIdToken(validatedData.firebaseIdToken);
    
    if (!decodedToken || !decodedToken.phone_number) {
      return NextResponse.json(
        { error: 'Invalid Firebase token or phone number not verified' },
        { status: 401 }
      );
    }

    const phoneNumber = decodedToken.phone_number.replace(/^\+91/, '');

    const user = await prisma.user.findUnique({
      where: { mobileNumber: phoneNumber },
      select: { id: true, isVerified: true, mobileNumber: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this mobile number' },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Your account is not verified' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully. You can now reset your password.',
      mobileNumber: user.mobileNumber,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Forgot password verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
