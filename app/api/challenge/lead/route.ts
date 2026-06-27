export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

const TELECRM_ENTERPRISE_ID = process.env.TELECRM_ENTERPRISE_ID;
const TELECRM_API_TOKEN = process.env.TELECRM_API_TOKEN;
const TELECRM_URL = TELECRM_ENTERPRISE_ID
  ? `https://next-api.telecrm.in/enterprise/${TELECRM_ENTERPRISE_ID}/autoupdatelead`
  : null;

async function pushToCRM(fields: Record<string, any>) {
  if (!TELECRM_URL || !TELECRM_API_TOKEN) {
    console.log('[Challenge Lead] TeleCRM not configured. Payload:', fields);
    return { ok: true };
  }
  try {
    const res = await fetch(TELECRM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TELECRM_API_TOKEN}`,
      },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.error('[Challenge Lead] TeleCRM rejected request:', res.status, errBody);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error('[Challenge Lead] TeleCRM push failed:', err);
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
      city,
      goal,
      preferred_time,
      source,
      prize,
      promo,
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
      return NextResponse.json({ error: 'A valid name and 10-digit mobile number are required' }, { status: 400 });
    }

    // TeleCRM's lead identifier is matched against these fields — see
    // https://docs.telecrm.in/concepts/lead-identifier. "name" + "phone"
    // are standard fields; everything else here is a candidate custom
    // field and will be silently dropped by TeleCRM unless it already
    // exists in the workspace under Settings → Custom Fields.
    const result = await pushToCRM({
      name: name.trim(),
      phone: cleanPhone.startsWith('91') ? cleanPhone : `91${phoneDigitsOnly}`,
      email: email || '',
      city: city || '',
      goal: goal || '',
      preferred_time: preferred_time || '',
      prize: prize || '',
      promo: promo || '',
      source: source || 'challenge-landing-page',
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      gclid: gclid || '',
      fbclid: fbclid || '',
      page_url: page_url || '',
      referrer: referrer || '',
    });

    if (!result.ok) {
      return NextResponse.json({ error: 'Could not save your details. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Challenge lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
