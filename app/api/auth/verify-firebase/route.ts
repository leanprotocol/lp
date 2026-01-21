import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyFirebaseSchema } from '@/lib/validations/auth';
import { verifyFirebaseIdToken } from '@/lib/firebase/admin';
import { hashPassword } from '@/lib/auth/password';
import { signJWT } from '@/lib/auth/jwt';
import { setAuthCookie } from '@/lib/auth/cookies';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyFirebaseSchema.parse(body);

    const decodedToken = await verifyFirebaseIdToken(validatedData.firebaseIdToken);
    
    if (!decodedToken || !decodedToken.phone_number) {
      return NextResponse.json(
        { error: 'Invalid Firebase token or phone number not verified' },
        { status: 401 }
      );
    }

    const phoneNumber = decodedToken.phone_number.replace(/^\+91/, '');

    const quizSessionId = request.cookies.get('quiz-session')?.value ?? null;

    let user = await prisma.user.findUnique({
      where: { mobileNumber: phoneNumber },
    });

    const hashedPassword = validatedData.password
      ? await hashPassword(validatedData.password)
      : await hashPassword(randomBytes(32).toString('hex'));

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
