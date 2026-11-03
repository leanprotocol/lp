export const runtime = 'nodejs';

/* Name and mobile, in exchange for a two-hour checkout token.
 *
 * /pro used to put a full OTP login between "Get started now" and Razorpay.
 * That was not decoration: /api/payment/create-order builds the Subscription
 * and Payment rows against a userId, so without an identity there is nothing
 * to create and the route 401s. This keeps the identity and drops the SMS.
 *
 * It is the pre-register logic plus the piece that was missing: the
 * temp-auth-token cookie. create-order, verify and fail already accept that
 * token as a fallback, but nothing issued it, so that branch was unreachable.
 *
 * The user is NOT verified. isVerified stays false and the password is a
 * random hash, so this does not let anyone into an existing account: the
 * token is scoped to checkout and expires in two hours. Someone entering a
 * number that already exists reaches checkout as that user, which lets them
 * pay for that account but not read it.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hashPassword } from '@/lib/auth/password';
import { randomBytes } from 'crypto';
import { signJWT } from '@/lib/auth/jwt';
import { setTempAuthCookie } from '@/lib/auth/cookies';

const schema = z.object({
  name: z
    .string()
    .min(2, 'Please enter your full name')
    .max(50, 'Name is too long')
    .regex(/^[a-zA-Z\s.]+$/, 'Name must contain only letters'),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    let user = await prisma.user.findUnique({
      where: { mobileNumber: data.mobileNumber },
    });

    if (user) {
      /* Only fill a missing name. An existing name is left alone: the person
         at the keyboard has not proved they own this number. */
      if (!user.name) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: data.name },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          mobileNumber: data.mobileNumber,
          name: data.name,
          isVerified: false,
          password: await hashPassword(randomBytes(32).toString('hex')),
        },
      });
    }

    const token = await signJWT(
      { userId: user.id, type: 'user', mobileNumber: user.mobileNumber },
      '2h'
    );

    const res = NextResponse.json({
      success: true,
      name: user.name,
      mobileNumber: user.mobileNumber,
    });
    setTempAuthCookie(res, token);
    return res;
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: error.errors?.[0]?.message || 'Please check your details' },
        { status: 400 }
      );
    }
    console.error('[quick-start] error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}