import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { z } from 'zod';

const updateProviderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  coveragePercentage: z.number().min(0).max(100).optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

// PUT - Update insurance provider
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = updateProviderSchema.parse(body);

    // Check if provider exists
    const existing = await prisma.insuranceProvider.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Insurance provider not found' },
        { status: 404 }
      );
    }

    // Check for duplicate name if name is being updated
    if (validatedData.name && validatedData.name !== existing.name) {
      const duplicate = await prisma.insuranceProvider.findUnique({
        where: { name: validatedData.name }
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'An insurance provider with this name already exists' },
          { status: 400 }
        );
      }
    }

    const provider = await prisma.insuranceProvider.update({
      where: { id: params.id },
      data: validatedData
    });

    return NextResponse.json({ 
      success: true,
      provider 
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating insurance provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove insurance provider
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    // Check if provider exists
    const existing = await prisma.insuranceProvider.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { quizSubmissions: true }
        }
      }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Insurance provider not found' },
        { status: 404 }
      );
    }

    // Check if provider has associated quiz submissions
    if (existing._count.quizSubmissions > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete insurance provider with existing quiz submissions',
          count: existing._count.quizSubmissions
        },
        { status: 400 }
      );
    }

    await prisma.insuranceProvider.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Insurance provider deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting insurance provider:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
