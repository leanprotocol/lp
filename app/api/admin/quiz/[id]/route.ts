import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reviewQuizSchema } from '@/lib/validations/quiz';
import { requireAuth } from '@/lib/auth/middleware';
import { notifyAdminsQuizApproved } from '@/lib/email/admin-alerts';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized || !user) return response!;

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Missing quiz submission id' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = reviewQuizSchema.parse(body);

    const submission = await prisma.quizSubmission.update({
      where: { id },
      data: {
        status: validatedData.status,
        reviewNotes: validatedData.reviewNotes,
        reviewedBy: user.userId,
        reviewedAt: new Date(),
      },
    });

    if (validatedData.status === 'APPROVED') {
      notifyAdminsQuizApproved(submission.id).catch((error) => {
        console.error('Failed to send quiz approved email:', error);
      });
    }

    return NextResponse.json({
      success: true,
      message: `Quiz ${validatedData.status.toLowerCase()} successfully`,
      submission,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Review quiz error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
