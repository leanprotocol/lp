export const runtime = "nodejs";

/* Verifies a senior-health-coach payment and tells TeleCRM, so callers can
   see who has paid. The lead already exists - /api/users/lead created it at
   the form - and both updates below find it by phone number.

   1. Lead fields (Async API, autoupdatelead): coach_call_payment = "Paid",
      coach_call_amount, coach_call_paid_on, razorpay_payment_id. Callers see
      them on the lead and can filter by them. The API names were created in
      TeleCRM under Settings -> Lead Fields; a misspelt name is dropped by
      TeleCRM without an error.
   2. A PAYMENT activity on the lead's timeline (Sync API), next to calls and
      notes. A payment ID is logged once per server instance, so a retried
      verify does not add a second activity.

   It does NOT change the lead's pipeline status, and does NOT send `source`
   (which would overwrite the questionnaire attribution).

   TeleCRM trouble never blocks the buyer: the payment is real once the
   signature and order check pass, so the confirmation is shown regardless and
   any CRM miss is logged. Razorpay keeps the payment either way. */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { COACH_AMOUNT_INR, COACH_ORDER_SOURCE } from "../../../../content/users-next";

const ENTERPRISE = process.env.TELECRM_ENTERPRISE_ID;
const ASYNC_TOKEN = process.env.TELECRM_API_TOKEN;
const SYNC_TOKEN = process.env.TELECRM_SYNC_TOKEN;
const ASYNC_URL = ENTERPRISE ? `https://next-api.telecrm.in/enterprise/${ENTERPRISE}/autoupdatelead` : null;
const SYNC_BASE = ENTERPRISE ? `https://next.telecrm.in/autoupdate/v2/enterprise/${ENTERPRISE}` : null;

/* TeleCRM field API names, exactly as shown under Lead Fields -> Information. */
const F = {
  payment: "coach_call_payment",
  amount: "coach_call_amount",
  paidOn: "coach_call_paid_on",
  paymentId: "razorpay_payment_id",
} as const;

async function updateLeadFields(phone91: string, paymentId: string, paidAt: number) {
  if (!ASYNC_URL || !ASYNC_TOKEN) {
    console.log("[Coach Verify] TeleCRM async not configured");
    return false;
  }
  try {
    const res = await fetch(ASYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${ASYNC_TOKEN}` },
      body: JSON.stringify({
        fields: {
          phone: phone91,
          [F.payment]: "Paid",
          [F.amount]: COACH_AMOUNT_INR,
          [F.paidOn]: paidAt,
          [F.paymentId]: paymentId,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[Coach Verify] fields rejected:", res.status, (await res.text().catch(() => "")).slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[Coach Verify] fields push failed:", e);
    return false;
  }
}

async function addPaymentActivity(phone91: string, paymentId: string) {
  if (!SYNC_BASE || !SYNC_TOKEN) {
    console.log("[Coach Verify] TELECRM_SYNC_TOKEN not set - payment activity skipped");
    return false;
  }
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${SYNC_TOKEN}` };
  try {
    const sr = await fetch(`${SYNC_BASE}/lead/search?skip=0&limit=1`, {
      method: "POST",
      headers,
      body: JSON.stringify({ fields: { phone: phone91 } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!sr.ok) throw new Error(`search ${sr.status}`);
    const found = await sr.json();
    const lead = Array.isArray(found?.data) ? found.data[0] : null;
    if (!lead?.id) throw new Error("lead not found by phone");

    const ar = await fetch(`${SYNC_BASE}/lead/${encodeURIComponent(lead.id)}/action`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        actions: [{ type: "PAYMENT", status: "COMPLETED", currency: "INR", amount: String(COACH_AMOUNT_INR) }],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!ar.ok) throw new Error(`action ${ar.status}: ${(await ar.text().catch(() => "")).slice(0, 200)}`);
    return true;
  } catch (e) {
    console.error("[Coach Verify] payment activity failed:", e);
    return false;
  }
}

/* One payment activity per payment, even if verify is called twice. */
const recentlyLogged = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const orderId = String(body.razorpayOrderId || "");
    const paymentId = String(body.razorpayPaymentId || "");
    const signature = String(body.razorpaySignature || "");

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    /* The signature proves Razorpay took this payment against this order. It
       does not prove the order was for this product, so read the order back.
       Amount and source were set server-side in coach-order; the phone comes
       from the order too, not from the browser. */
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = (await razorpay.orders.fetch(orderId)) as unknown as {
      amount: number | string;
      notes?: Record<string, string>;
    };
    const notes = order.notes || {};
    if (Number(order.amount) !== COACH_AMOUNT_INR * 100 || notes.source !== COACH_ORDER_SOURCE) {
      return NextResponse.json({ error: "This payment does not match a coach call booking" }, { status: 400 });
    }

    const phone = String(notes.phone || "").replace(/\D/g, "");
    if (phone) {
      const phone91 = `91${phone}`;
      const firstTime = !recentlyLogged.has(paymentId);
      recentlyLogged.set(paymentId, Date.now());
      if (recentlyLogged.size > 1000) recentlyLogged.clear();

      const [fieldsOk, activityOk] = await Promise.all([
        updateLeadFields(phone91, paymentId, Date.now()),
        firstTime ? addPaymentActivity(phone91, paymentId) : Promise.resolve(true),
      ]);
      if (!fieldsOk || !activityOk) {
        console.error("[Coach Verify] PAID but TeleCRM not fully updated:", { orderId, paymentId, phone, fieldsOk, activityOk });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Coach Verify] error:", error);
    return NextResponse.json({ error: "Could not confirm the payment" }, { status: 500 });
  }
}