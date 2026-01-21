export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth/password';

const createAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isActive: z.boolean().optional(),
});

// GET - List all admins
export async function GET(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ admins });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new admin
export async function POST(request: NextRequest) {
  try {
    const { authorized, user, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const validatedData = createAdminSchema.parse(body);

    const normalizedEmail = validatedData.email.toLowerCase();

    const existing = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An admin with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const newAdmin = await prisma.admin.create({
      data: {
        email: normalizedEmail,
        name: validatedData.name,
        password: hashedPassword,
        role: 'admin',
        isActive: validatedData.isActive ?? true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        admin: newAdmin,
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

    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
