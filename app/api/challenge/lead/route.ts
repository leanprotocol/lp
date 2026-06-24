export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// ─── Paste your CRM webhook URL here when ready ──────────────────────────────
// This should be the SAME endpoint used in /api/challenge/verify/route.ts
const CRM_ENDPOINT = ""; // e.g. "https://your-crm.example.com/api/leads"
// ───────────────────────────────────────────────────────────────────────────

async function pushToCRM(payload: Record<string, any>) {
  if (!CRM_ENDPOINT) {
    console.log('[Challenge Lead] CRM_ENDPOINT not set. Payload:', payload);
    return { ok: true };
  }
  try {
    const res = await fetch(CRM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch (err) {
    console.error('[Challenge Lead] CRM push failed:', err);
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
    if (!name?.trim() || !/^[6-9]\d{9}$/.test(cleanPhone.replace(/^91/, ''))) {
      return NextResponse.json({ error: 'A valid name and 10-digit mobile number are required' }, { status: 400 });
    }

    const result = await pushToCRM({
      name: name.trim(),
      phone: phone || `+91${cleanPhone}`,
      email: email || '',
      city: city || '',
      goal: goal || '',
      preferred_time: preferred_time || '',
      prize: prize || '',
      promo: promo || '',
      source: source || 'challenge-landing-page',
      lead_status: 'new',
      team: 'sales',
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      gclid: gclid || '',
      fbclid: fbclid || '',
      page_url: page_url || '',
      referrer: referrer || '',
      submitted_at: new Date().toISOString(),
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
