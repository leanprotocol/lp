import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseSchema } from '@/lib/validations/auth';
import { verifyFirebaseIdToken } from '@/lib/firebase/admin';
import { hashPassword } from '@/lib/auth/password';
import { signJWT } from '@/lib/auth/jwt';
import { clearAuthCookie, setAuthCookie } from '@/lib/auth/cookies';
import { randomBytes } from 'crypto';
import { isTestToken, testDecodedToken } from '@/lib/auth/test-mode';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyFirebaseSchema.parse(body);

    /* The test token is accepted in development only - see lib/auth/test-mode.ts */
    const decodedToken = isTestToken(validatedData.firebaseIdToken)
      ? testDecodedToken()
      : await verifyFirebaseIdToken(validatedData.firebaseIdToken);
    
    if (!decodedToken || !decodedToken.phone_number) {
      console.warn('[Auth] Firebase token rejected');
      return NextResponse.json(
        { error: 'Invalid Firebase token or phone number not verified' },
        { status: 401 }
      );
    }

    const phoneNumber = decodedToken.phone_number.replace(/^\+91/, '');

    const quizSessionId = request.cookies.get('quiz-session')?.value ?? null;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { mobileNumber: phoneNumber },
      });
    } catch (dbError) {
      console.error('[Auth] Database error finding user:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please ensure your DB is running.' },
        { status: 500 }
      );
    }

    const hashedPassword = validatedData.password
      ? await hashPassword(validatedData.password)
      : await hashPassword(randomBytes(32).toString('hex'));

    try {
      if (!user) {
        user = await prisma.user.create({
          data: {
            mobileNumber: phoneNumber,
            name: validatedData.name || null,
            isVerified: true,
            password: hashedPassword,
          },
        });
      } else {
        const updateData: Record<string, any> = {};

        if (validatedData.password) {
          updateData.password = hashedPassword;
        }

        if (!user.isVerified) {
          updateData.isVerified = true;
        }

        if (validatedData.name && !user.name) {
          updateData.name = validatedData.name;
        }

        user = await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
      }
    } catch (dbError) {
      console.error('[Auth] Database error saving user:', dbError);
      return NextResponse.json(
        { error: 'Failed to save user data. Please check database migrations.' },
        { status: 500 }
      );
    }

    if (quizSessionId) {
      const sessionSubmission = await (prisma.quizSubmission as any).findFirst({
        where: { quizSessionId },
      });

      if (sessionSubmission && !sessionSubmission.userId) {
        const userSubmission = await prisma.quizSubmission.findFirst({
          where: { userId: user.id },
        });

        if (userSubmission) {
          await prisma.quizSubmission.update({
            where: { id: userSubmission.id },
            data: {
              answers: sessionSubmission.answers as any,
              insuranceProviderId: sessionSubmission.insuranceProviderId,
              status: sessionSubmission.status,
            },
          });
          await prisma.quizSubmission.delete({ where: { id: sessionSubmission.id } });
        } else {
          await (prisma.quizSubmission as any).update({
            where: { id: sessionSubmission.id },
            data: {
              userId: user.id,
              quizSessionId: null,
            },
          });
        }
      }
    }

    const token = await signJWT({
      userId: user.id,
      type: 'user',
      mobileNumber: user.mobileNumber,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      user: {
        id: user.id,
        mobileNumber: user.mobileNumber,
        name: user.name,
        isVerified: user.isVerified,
      },
    });

    clearAuthCookie(response);
    setAuthCookie(response, token);

    return response;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Firebase verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}