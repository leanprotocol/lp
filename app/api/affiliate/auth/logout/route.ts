import { NextRequest, NextResponse } from 'next/server';
import { clearAffiliateAuthCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  clearAffiliateAuthCookie(response);

  return response;
}
