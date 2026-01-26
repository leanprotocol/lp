export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth/password';
import { randomBytes } from 'crypto';

const preRegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
  mobileNumber: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(15, 'Mobile number must be at most 15 digits')
    .regex(/^[0-9]+$/, 'Mobile number must contain only digits'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = preRegisterSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { mobileNumber: validatedData.mobileNumber },
    });

    if (existingUser) {
      const updateData: Record<string, any> = {};

      if (validatedData.name && existingUser.name !== validatedData.name) {
        updateData.name = validatedData.name;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: updateData,
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: existingUser.id,
          mobileNumber: existingUser.mobileNumber,
          name: updateData.name ?? existingUser.name,
          isVerified: existingUser.isVerified,
        },
        existed: true,
      });
    }

    const hashedPassword = await hashPassword(randomBytes(32).toString('hex'));

    const createdUser = await prisma.user.create({
      data: {
        mobileNumber: validatedData.mobileNumber,
        name: validatedData.name,
        isVerified: false,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: createdUser.id,
        mobileNumber: createdUser.mobileNumber,
        name: createdUser.name,
        isVerified: createdUser.isVerified,
      },
      existed: false,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Pre-register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
