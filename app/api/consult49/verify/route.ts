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
    console.log('[Consult49 Verify] TeleCRM not configured. Payload:', fields);
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
      body: JSON.stringify({ fields: cleanFields }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[Consult49 Verify] TeleCRM rejected request:', res.status, errBody);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[Consult49 Verify] TeleCRM push failed:', err);
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
      preferred_time,
      bmi,
    } = body as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
      name?: string;
      phone?: string;
      email?: string;
      city?: string;
      preferred_time?: string;
      bmi?: string;
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
      preferred_time: preferred_time || '',
      bmi: bmi || '',
      product: 'GLP-1 Doctor Consultation',
      amount: 49,
      source: 'consult49-checkout',
      lead_status: 'paid',
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
    });

    return NextResponse.json({ success: true, message: 'Payment verified' });
  } catch (error: any) {
    console.error('Consult49 verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
