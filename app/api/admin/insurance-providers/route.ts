export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { z } from 'zod';

const createProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  coveragePercentage: z.number().min(0).max(100),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

const updateProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  coveragePercentage: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

// GET - List all insurance providers (admin)
export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const providers = await prisma.insuranceProvider.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ],
      include: {
        _count: {
          select: { quizSubmissions: true }
        }
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

// POST - Create new insurance provider
export async function POST(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = createProviderSchema.parse(body);

    // Check for duplicate name
    const existing = await prisma.insuranceProvider.findUnique({
      where: { name: validatedData.name }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An insurance provider with this name already exists' },
        { status: 400 }
      );
    }

    const provider = await prisma.insuranceProvider.create({
      data: {
        name: validatedData.name,
        coveragePercentage: validatedData.coveragePercentage,
        description: validatedData.description,
        isActive: validatedData.isActive ?? true,
        displayOrder: validatedData.displayOrder ?? 0,
      }
    });

    return NextResponse.json({ 
      success: true,
      provider 
    }, { status: 201 });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating insurance provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
