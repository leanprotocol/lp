export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List all active insurance providers (public)
export async function GET() {
  try {
    const providers = await prisma.insuranceProvider.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      select: {
        id: true,
        name: true,
        coveragePercentage: true,
        description: true,
        displayOrder: true
      }
    });

    return NextResponse.json({ providers });
  } catch (error) {
    console.error('Error fetching insurance providers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
