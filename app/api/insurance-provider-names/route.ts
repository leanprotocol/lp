export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const providers = await prisma.insuranceProvider.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
      select: { name: true },
    });

    return NextResponse.json({
      providers: providers.map((provider: { name: string }) => provider.name),
    });
  } catch (error) {
    console.error('Error fetching insurance provider names:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
