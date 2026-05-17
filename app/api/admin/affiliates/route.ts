export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth/middleware';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const affiliates = await prisma.affiliate.findMany({
      include: {
        commissions: {
          select: {
            amount: true,
            status: true,
            payment: { select: { amount: true } }
          }
        },
        _count: {
          select: { leads: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedAffiliates = affiliates.map(affiliate => {
      let gross = 0;
      let net = 0;
      let pending = 0;
      let eligible = 0;
      let paid = 0;

      affiliate.commissions.forEach(c => {
        gross += c.payment.amount;
        net += c.amount;
        if (c.status === 'PENDING') pending += c.amount;
        if (c.status === 'ELIGIBLE') eligible += c.amount;
        if (c.status === 'PAID') paid += c.amount;
      });

      return {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        mobileNumber: affiliate.mobileNumber,
        referralCode: affiliate.referralCode,
        isActive: affiliate.isActive,
        createdAt: affiliate.createdAt,
        leadsCount: affiliate._count.leads,
        stats: {
          gross,
          net,
          pending,
          eligible,
          paid,
          unsettled: pending + eligible
        }
      };
    });

    return NextResponse.json({
      success: true,
      affiliates: formattedAffiliates,
    });

  } catch (error: any) {
    console.error('Admin get affiliates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { authorized, response } = await requireAuth(request, ['admin']);
    if (!authorized) return response!;

    const body = await request.json();
    const { name, email, mobileNumber, referralCode, password } = body;

    if (!name || !email || !mobileNumber || !password) {
      return NextResponse.json({ error: 'name, email, mobileNumber, and password are required.' }, { status: 400 });
    }

    // Generate referral code from name if not provided
    const finalCode = referralCode?.trim().toUpperCase() ||
      name.trim().toUpperCase().replace(/\s+/g, '').slice(0, 6) +
      Math.floor(100 + Math.random() * 900);

    const hashedPassword = await bcrypt.hash(password, 10);

    const affiliate = await prisma.affiliate.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobileNumber: mobileNumber.trim(),
        password: hashedPassword,
        referralCode: finalCode,
        isActive: true,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      affiliate: {
        id: affiliate.id,
        name: affiliate.name,
        email: affiliate.email,
        mobileNumber: affiliate.mobileNumber,
        referralCode: affiliate.referralCode,
        isActive: affiliate.isActive,
      },
    }, { status: 201 });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email, mobile number, or referral code already exists.' }, { status: 409 });
    }
    console.error('Admin create affiliate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
