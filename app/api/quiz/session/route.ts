export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const existing = request.cookies.get('quiz-session')?.value;
  const quizSessionId = existing ?? crypto.randomUUID();

  const response = NextResponse.json({ success: true, quizSessionId }, { status: 200 });

  if (!existing) {
    response.cookies.set({
      name: 'quiz-session',
      value: quizSessionId,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}
