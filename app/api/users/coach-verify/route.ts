export const runtime = "nodejs";

/* Verifies a senior-health-coach payment and marks the TeleCRM lead as paid.
   The lead already exists - /api/users/lead created it at the form - and
   autoupdatelead matches on phone, so this updates that same lead.

   It deliberately does NOT send `source`, which would overwrite the
   questionnaire attribution recorded at the form. */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { COACH_AMOUNT_INR, COACH_ORDER_SOURCE } from "../../../../content/users-next";

const TELECRM_ENTERPRISE_ID = process.env.TELECRM_ENTERPRISE_ID;
const TELECRM_API_TOKEN = process.env.TELECRM_API_TOKEN;
const TELECRM_URL = TELECRM_ENTERPRISE_ID
  ? `https://next-api.telecrm.in/enterprise/${TELECRM_ENTERPRISE_ID}/autoupdatelead`
  : null;

async function pushToCRM(fields: Record<string, unknown>) {
  if (!TELECRM_URL || !TELECRM_API_TOKEN) {
    console.log("[Coach Verify] TeleCRM not configured. Payload:", fields);
    return { ok: true };
  }
  try {
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== "" && v !== null && v !== undefined)
    );
    const res = await fetch(TELECRM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TELECRM_API_TOKEN}` },
      body: JSON.stringify({ fields: cleanFields }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("[Coach Verify] TeleCRM rejected request:", res.status, errBody);
      return { ok: false };
    }
    return { ok: true };
  } catch (err) {
    console.error("[Coach Verify] TeleCRM push failed:", err);
    return { ok: false };
  }
}

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
       Amount and source were set server-side in coach-order. The name and
       phone come from the order too, not from the browser. */
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
      const crm = await pushToCRM({
        name: notes.name || "",
        phone: `91${phone}`,
        product: "Senior health coach call",
        amount: COACH_AMOUNT_INR,
        lead_status: "paid",
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
      });
      /* The payment is real whether or not TeleCRM accepted the update, so
         the buyer still gets a confirmation. The miss is logged, and the
         payment is visible in the Razorpay dashboard either way. */
      if (!crm.ok) console.error("[Coach Verify] PAID but CRM not updated:", orderId, paymentId, phone);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Coach Verify] error:", error);
    return NextResponse.json({ error: "Could not confirm the payment" }, { status: 500 });
  }
}