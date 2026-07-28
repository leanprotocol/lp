export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

const TELECRM_ENTERPRISE_ID = process.env.TELECRM_ENTERPRISE_ID;
const TELECRM_API_TOKEN = process.env.TELECRM_API_TOKEN;
const TELECRM_URL = TELECRM_ENTERPRISE_ID
  ? `https://next-api.telecrm.in/enterprise/${TELECRM_ENTERPRISE_ID}/autoupdatelead`
  : null;

async function pushToCRM(fields: Record<string, any>) {
  if (!TELECRM_URL || !TELECRM_API_TOKEN) {
    console.log('[Users Lead] TeleCRM not configured. Payload:', fields);
    return { ok: true };
  }
  try {
    // Remove empty strings — only send fields that have values
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
      console.error('[Users Lead] TeleCRM rejected request:', res.status, errBody);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[Users Lead] TeleCRM push failed:', err);
    return { ok: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      weight,
      goal,
      timeline,
      support_type,
      source,
      utm_source,
      utm_medium,
      utm_campaign,
      gclid,
      fbclid,
      page_url,
      referrer,
    } = body as Record<string, string>;

    const cleanPhone = (phone || '').replace(/\D/g, '');
    const phoneDigitsOnly = cleanPhone.replace(/^91/, '');
    if (!name?.trim() || !/^[6-9]\d{9}$/.test(phoneDigitsOnly)) {
      return NextResponse.json(
        { error: 'A valid name and 10-digit mobile number are required' },
        { status: 400 }
      );
    }

    const result = await pushToCRM({
      name: name.trim(),
      phone: cleanPhone.startsWith('91') ? cleanPhone : `91${phoneDigitsOnly}`,
      email: email || '',
      weight: weight || '',
      goal: goal || '',
      timeline: timeline || '',
      support_type: support_type || '',
      source: source || 'users-questionnaire',
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      gclid: gclid || '',
      fbclid: fbclid || '',
      page_url: page_url || '',
      referrer: referrer || '',
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: 'Could not save your details. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Users lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
