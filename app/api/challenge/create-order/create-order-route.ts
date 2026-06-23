export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// ─── Fixed price for the 30 Days Hard Challenge campaign ─────────────────────
// This is intentionally hardcoded and independent of the SubscriptionPlan
// table / admin dashboard. Change this number directly when the price changes.
const CHALLENGE_AMOUNT_INR = 3999;
// ───────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, phone, email, city, promoApplied } = body as {
      name?: string;
      phone?: string;
      email?: string;
      city?: string;
      promoApplied?: boolean;
    };

    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'A valid 10-digit mobile number is required' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const amountPaise = Math.round(CHALLENGE_AMOUNT_INR * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      notes: {
        source: 'challenge-landing-page',
        name: name || '',
        phone: cleanPhone,
        email: email || '',
        city: city || '',
        promoApplied: promoApplied ? 'yes' : 'no',
        durationDays: promoApplied ? '45' : '30',
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: CHALLENGE_AMOUNT_INR,
      currency: 'INR',
      keyId,
    });
  } catch (error: any) {
    console.error('Challenge create-order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
