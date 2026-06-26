export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const TELECRM_ENTERPRISE_ID = process.env.TELECRM_ENTERPRISE_ID;
const TELECRM_API_TOKEN = process.env.TELECRM_API_TOKEN;
const TELECRM_URL = TELECRM_ENTERPRISE_ID
  ? `https://next-api.telecrm.in/enterprise/${TELECRM_ENTERPRISE_ID}/autoupdatelead`
  : null;

async function pushToCRM(fields: Record<string, any>) {
  if (!TELECRM_URL || !TELECRM_API_TOKEN) {
    console.log('[Challenge Verify] TeleCRM not configured. Payload:', fields);
    return { ok: true };
  }
  try {
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    );

    const res = await fetch(TELECRM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TELECRM_API_TOKEN}`,
      },
      body: JSON.stringify({
        fields: cleanFields,
        actions: [
          {
            type: 'SYSTEM_NOTE',
            text: `✅ Payment confirmed\nPlan: ${cleanFields.plan || '30 Days Hard Challenge'}\nAmount: ₹${cleanFields.amount || 3999}\nRazorpay Order: ${cleanFields.razorpay_order_id}\nPayment ID: ${cleanFields.razorpay_payment_id}\nSubmitted: ${new Date().toISOString()}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[Challenge Verify] TeleCRM rejected request:', res.status, errBody);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[Challenge Verify] TeleCRM push failed:', err);
    return { ok: false };
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

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const cleanPhone = (phone || '').replace(/\D/g, '');

    await pushToCRM({
      name: name || '',
      phone: cleanPhone ? (cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`) : '',
      email: email || '',
      city: city || '',
      plan: '30 Days Hard Challenge',
      duration: promoApplied ? '45 days (30 + 15 free)' : '30 days',
      amount: 3999,
      promo: promoApplied ? '30+15HARD' : '',
      source: 'challenge-checkout',
      lead_status: 'paid',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
    });

    return NextResponse.json({ success: true, message: 'Payment verified' });
  } catch (error: any) {
    console.error('Challenge verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}