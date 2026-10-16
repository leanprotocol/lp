export const runtime = "nodejs";

/* Issues the checkout bonus coupon when a visitor reveals it. The expiry is
   the end of their offer window, capped at BONUS.windowMinutes from now. */

import { NextRequest, NextResponse } from "next/server";
import { BONUS } from "../../../../content/course";
import { issueCoupon } from "../../../../lib/course-coupon";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { windowEnd?: number };
  const now = Date.now();
  const cap = now + BONUS.windowMinutes * 60_000;
  const end = Math.min(Number(body.windowEnd) || 0, cap);
  if (!(end > now)) return NextResponse.json({ error: "This offer has ended" }, { status: 410 });
  const token = issueCoupon(end);
  if (!token) return NextResponse.json({ error: "Offer unavailable" }, { status: 500 });
  return NextResponse.json({ success: true, token, code: BONUS.code, expiresAt: end, discount: BONUS.discountInr });
}