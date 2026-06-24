export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ─── Paste your CRM webhook URL here when ready ──────────────────────────────
const CRM_ENDPOINT = ""; // e.g. "https://your-crm.example.com/api/leads"
// ───────────────────────────────────────────────────────────────────────────

async function pushToCRM(payload: Record<string, any>) {
  if (!CRM_ENDPOINT) {
    console.log('[Challenge] CRM_ENDPOINT not set. Payload:', payload);
    return;
  }
  try {
    await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[Challenge] CRM push failed:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      name,
      phone,
      email,
      city,
      promoApplied,
    } = body as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      name?: string;
      phone?: string;
      email?: string;
      city?: string;
      promoApplied?: boolean;
    };

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Verify signature: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Push the confirmed order to CRM
    await pushToCRM({
      name: name || '',
      phone: phone ? `+91${phone.replace(/\D/g, '')}` : '',
      email: email || '',
      city: city || '',
      plan: '30 Days Hard Challenge',
      duration: promoApplied ? '45 days (30 + 15 free)' : '30 days',
      amount: 3999,
      promo: promoApplied ? '30+15HARD' : '',
      source: 'challenge-checkout',
      lead_status: 'paid',
      team: 'sales',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      submitted_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Payment verified' });
  } catch (error: any) {
    console.error('Challenge verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
