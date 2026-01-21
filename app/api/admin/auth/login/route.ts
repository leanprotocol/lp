export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
import { adminLoginSchema } from '@/lib/validations/auth';
import { signJWT } from '@/lib/auth/jwt';
import { setAdminAuthCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = adminLoginSchema.parse(body);

    const normalizedEmail = validatedData.email.toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin || !admin.isActive) {
      console.log('Login attempt:', { email: normalizedEmail, found: !!admin, isActive: admin?.isActive });
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(validatedData.password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    let effectiveAdmin = admin;

    if (!effectiveAdmin.isActive) {
      const activeAdminCount = await prisma.admin.count({ where: { isActive: true } });
      if (activeAdminCount === 0) {
        effectiveAdmin = await prisma.admin.update({
          where: { id: effectiveAdmin.id },
          data: { isActive: true, role: 'admin' },
        });
      } else {
        return NextResponse.json(
          { error: 'Admin account is inactive' },
          { status: 403 }
        );
      }
    }

    const token = await signJWT({
      userId: effectiveAdmin.id,
      type: 'admin',
      email: effectiveAdmin.email,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin login successful',
      admin: {
        id: effectiveAdmin.id,
        email: effectiveAdmin.email,
        name: effectiveAdmin.name,
        role: effectiveAdmin.role,
      },
    });

    setAdminAuthCookie(response, token);

    return response;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
