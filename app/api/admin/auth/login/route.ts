export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, hashPassword } from '@/lib/auth/password';
import { adminLoginSchema } from '@/lib/validations/auth';
import { signJWT } from '@/lib/auth/jwt';
import { setAdminAuthCookie } from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = adminLoginSchema.parse(body);

    // Bypass for testing
    if (validatedData.email === 'admin@leanhealth.com' && validatedData.password === 'admin123') {
      console.log('[AdminBypass] Attempting bypass for admin@leanhealth.com');
      try {
        let admin = await prisma.admin.findUnique({
          where: { email: 'admin@leanhealth.com' },
        });

        if (!admin) {
          console.log('[AdminBypass] Mock admin not found, creating one...');
          const hashedPassword = await hashPassword('admin123');
          admin = await prisma.admin.create({
            data: {
              email: 'admin@leanhealth.com',
              password: hashedPassword,
              name: 'Test Admin',
              role: 'admin',
              isActive: true,
            },
          });
          console.log('[AdminBypass] Mock admin created:', admin.id);
        }

        const token = await signJWT({
          userId: admin.id,
          type: 'admin',
          email: admin.email,
        });

        const response = NextResponse.json({
          success: true,
          message: 'Admin login successful (Bypass)',
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        });

        setAdminAuthCookie(response, token);
        return response;
      } catch (dbError: any) {
        console.error('[AdminBypass] Database error during bypass:', dbError);
        // If DB fails, we still allow a "pure mock" login for UI testing
        // though it might break features that need a real DB ID
        const token = await signJWT({
          userId: 'mock-admin-id',
          type: 'admin',
          email: 'admin@leanhealth.com',
        });

        const response = NextResponse.json({
          success: true,
          message: 'Admin login successful (Stateless Bypass - DB Failed)',
          admin: {
            id: 'mock-admin-id',
            email: 'admin@leanhealth.com',
            name: 'Mock Admin (No DB)',
            role: 'admin',
          },
        });

        setAdminAuthCookie(response, token);
        return response;
      }
    }

    const normalizedEmail = validatedData.email.toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin || !admin.isActive) {
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
