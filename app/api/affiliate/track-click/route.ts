export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { ref } = await request.json();

    if (!ref) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }

    // Increment click count for the affiliate
    await prisma.affiliate.update({
      where: { referralCode: ref },
      data: { clicks: { increment: 1 } }
    }).catch(err => {
        // If affiliate doesn't exist, just ignore it
        console.warn(`Attempted to track click for non-existent referral code: ${ref}`);
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Track click error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
