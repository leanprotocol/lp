import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { forgotPasswordResetSchema } from '@/lib/validations/auth';
import { verifyFirebaseIdToken } from '@/lib/firebase/admin';
import { hashPassword } from '@/lib/auth/password';
import { signJWT } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordResetSchema.parse(body);

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

    const hashedPassword = await hashPassword(validatedData.newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    const token = await signJWT({
      userId: updatedUser.id,
      type: 'user',
      mobileNumber: updatedUser.mobileNumber,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Password reset successfully. You are now logged in.',
      user: {
        id: updatedUser.id,
        mobileNumber: updatedUser.mobileNumber,
        name: updatedUser.name,
        isVerified: updatedUser.isVerified,
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

    console.error('Forgot password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
