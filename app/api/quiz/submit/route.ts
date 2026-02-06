export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { quizSubmissionSchema } from '@/lib/validations/quiz';
import { requireAuth } from '@/lib/auth/middleware';
import { verifyJWT } from '@/lib/auth/jwt';
import { notifyAdminsQuizSubmitted } from '@/lib/email/admin-alerts';
import { verifyFirebaseIdToken } from '@/lib/firebase/admin';
import { hashPassword } from '@/lib/auth/password';
import { randomBytes } from 'crypto';

type CoverageStatus = 'not_applicable' | 'covered' | 'partial' | 'not_covered';

function buildCoverageMessage(
  status: CoverageStatus,
  providerName?: string | null,
  coveragePercentage?: number | null,
  supportingDetail?: string | null
) {
  switch (status) {
    case 'covered':
      return {
        title: 'Great news!',
        message: `${providerName} currently covers this treatment. We'll coordinate with them and confirm the exact steps once your review is complete${coveragePercentage ? ` (${coveragePercentage}% coverage as per their policy).` : '.'}`,
        supportingDetail,
      };
    case 'partial':
      return {
        title: 'Partially covered',
        message: `${providerName} can cover part of this program${coveragePercentage ? ` (about ${coveragePercentage}%)` : ''}. Our care team will walk you through the remaining out-of-pocket portion.`,
        supportingDetail,
      };
    case 'not_covered':
      return {
        title: 'Not covered by your provider',
        message: `${providerName} does not currently reimburse this treatment. We'll still build a care plan and share affordable payment options so that coverage isn’t a blocker.`,
        supportingDetail,
      };
    default:
      return {
        title: 'Quiz submitted',
        message:
          'Thanks for completing the quiz. We’ll match you with the right care path and loop you into insurance options only if you decide to connect a provider later.',
        supportingDetail,
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request, ['user']);
    const authorized = auth.authorized;
    const user = auth.user;
    const quizSessionId = request.cookies.get('quiz-session')?.value ?? null;

    let tempUserId: string | null = null;
    if (!authorized || !user) {
      const tempToken = request.cookies.get('temp-auth-token')?.value;
      if (tempToken) {
        const decoded = await verifyJWT(tempToken);
        if (decoded.type === 'user') {
          tempUserId = decoded.userId;
        }
      }
    }

    const identity = authorized && user
      ? { type: 'user' as const, userId: user.userId }
      : tempUserId
        ? { type: 'user' as const, userId: tempUserId }
        : quizSessionId
          ? { type: 'session' as const, quizSessionId }
          : null;

    if (!identity) {
      return NextResponse.json(
        { error: 'Missing quiz session. Please refresh and try again.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = quizSubmissionSchema.parse(body);

    let tokenUserId: string | null = null;
    if (!authorized && validatedData.firebaseIdToken) {
      const decodedToken = await verifyFirebaseIdToken(validatedData.firebaseIdToken);
      if (decodedToken?.phone_number) {
        const phoneNumber = decodedToken.phone_number.replace(/^\+91/, '');
        const existingUser = await prisma.user.findUnique({
          where: { mobileNumber: phoneNumber },
        });

        if (existingUser) {
          tokenUserId = existingUser.id;
          if ((!existingUser.isVerified || (!existingUser.name && validatedData.name)) && (validatedData.name || !existingUser.isVerified)) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                ...(existingUser.isVerified ? {} : { isVerified: true }),
                ...(!existingUser.name && validatedData.name ? { name: validatedData.name } : {}),
              },
            });
          }
        } else {
          const hashedPassword = await hashPassword(randomBytes(32).toString('hex'));
          const created = await prisma.user.create({
            data: {
              mobileNumber: phoneNumber,
              name: validatedData.name || null,
              isVerified: true,
              password: hashedPassword,
            },
          });
          tokenUserId = created.id;
        }
      }
    }

    const effectiveIdentity = authorized && user
      ? { type: 'user' as const, userId: user.userId }
      : tokenUserId
        ? { type: 'user' as const, userId: tokenUserId }
        : identity;

    const existingSubmission = await prisma.quizSubmission.findFirst({
      where: (effectiveIdentity.type === 'user'
        ? { userId: effectiveIdentity.userId }
        : { quizSessionId: effectiveIdentity.quizSessionId }) as any,
    });

    let coverageStatus: CoverageStatus = 'not_applicable';
    let coverageMessage = buildCoverageMessage(coverageStatus);
    let providerName: string | null = null;
    let coveragePercentage: number | null = null;
    let coverageSupportingDetail: string | null = null;

    if (validatedData.insuranceProviderId) {
      const provider = await prisma.insuranceProvider.findUnique({
        where: { id: validatedData.insuranceProviderId },
        select: {
          id: true,
          name: true,
          coveragePercentage: true,
          description: true,
        },
      });

      if (provider) {
        providerName = provider.name;
        coveragePercentage = provider.coveragePercentage ?? null;
        coverageSupportingDetail = provider.description ?? null;

        if ((provider.coveragePercentage ?? 0) >= 80) {
          coverageStatus = 'covered';
        } else if ((provider.coveragePercentage ?? 0) > 0) {
          coverageStatus = 'partial';
        } else {
          coverageStatus = 'not_covered';
        }
      } else {
        coverageStatus = 'not_covered';
      }

      coverageMessage = buildCoverageMessage(
        coverageStatus,
        providerName,
        coveragePercentage,
        coverageSupportingDetail
      );
    }

    let submission;

    if (effectiveIdentity.type === 'user') {
      if (quizSessionId) {
        const sessionSubmission = await (prisma.quizSubmission as any).findFirst({
          where: { quizSessionId },
        });

        if (sessionSubmission && !sessionSubmission.userId) {
          if (existingSubmission) {
            await prisma.quizSubmission.update({
              where: { id: existingSubmission.id },
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
                userId: effectiveIdentity.userId,
                quizSessionId: null,
              },
            });
          }
        }
      }

      if (existingSubmission) {
        submission = await prisma.quizSubmission.update({
          where: { id: existingSubmission.id },
          data: {
            answers: validatedData.answers as any,
            insuranceProviderId: validatedData.insuranceProviderId,
            status: 'PENDING_REVIEW',
          },
        });
      } else {
        submission = await prisma.quizSubmission.create({
          data: {
            userId: effectiveIdentity.userId,
            answers: validatedData.answers as any,
            insuranceProviderId: validatedData.insuranceProviderId,
            status: 'PENDING_REVIEW',
          } as any,
        });
      }
    } else {
      submission = await (prisma.quizSubmission as any).upsert({
        where: { quizSessionId: effectiveIdentity.quizSessionId },
        update: {
          answers: validatedData.answers,
          insuranceProviderId: validatedData.insuranceProviderId,
          status: 'PENDING_REVIEW',
        },
        create: {
          quizSessionId: effectiveIdentity.quizSessionId,
          answers: validatedData.answers,
          insuranceProviderId: validatedData.insuranceProviderId,
          status: 'PENDING_REVIEW',
        },
      });
    }

    notifyAdminsQuizSubmitted(submission.id).catch((error) => {
      console.error('Failed to send quiz submission email:', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Quiz submitted successfully. Your submission will be reviewed within 24 hours.',
        id: submission.id,
        status: submission.status,
        coverage: {
          status: coverageStatus,
          providerName,
          coveragePercentage,
          ...coverageMessage,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

