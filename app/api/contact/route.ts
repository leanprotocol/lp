export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactQuerySchema } from '@/lib/validations/contact';
import { authenticate } from '@/lib/auth/middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactQuerySchema.parse(body);

    const { authenticated, user } = await authenticate(request);

    const contactQuery = await prisma.contactQuery.create({
      data: {
        name: validatedData.name,
        mobileNumber: validatedData.mobileNumber,
        email: validatedData.email || null,
        message: validatedData.message,
        userId: authenticated && user?.type === 'user' ? user.userId : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your query has been submitted successfully. We will get back to you soon.',
      id: contactQuery.id,
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact query error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
