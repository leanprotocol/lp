export const runtime = "nodejs";

/* Verifies a quiz-funnel payment and marks the lead Paid in TeleCRM.
 *
 * The lead already exists: /api/course-quiz/lead created it when the form
 * was submitted. This updates it by phone number, which is also the number
 * the app unlocks the course for.
 *
 * The signature alone proves Razorpay took this payment against this order.
 * It does not prove the order was for this product, so the order is read
 * back and both the amount and the source are checked. Amount and phone come
 * from the order, never from the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { QUIZ_PRICE_INR, QUIZ_ORDER_SOURCE } from "@/content/course-quiz";

const ENT = process.env.TELECRM_ENTERPRISE_ID;
const TOKEN = process.env.TELECRM_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const orderId = String(b.razorpayOrderId || "");
    const paymentId = String(b.razorpayPaymentId || "");
    const signature = String(b.razorpaySignature || "");
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    const x = Buffer.from(expected);
    const y = Buffer.from(signature);
    if (x.length !== y.length || !crypto.timingSafeEqual(x, y)) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const order = (await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.fetch(orderId)) as unknown as {
      amount: number | string;
      notes?: Record<string, string>;
    };
    const notes = order.notes || {};
    if (Number(order.amount) !== QUIZ_PRICE_INR * 100 || notes.source !== QUIZ_ORDER_SOURCE) {
      return NextResponse.json({ error: "This payment does not match the quiz offer" }, { status: 400 });
    }

    const phone = String(notes.phone || "").replace(/\D/g, "");
    if (phone && ENT && TOKEN) {
      try {
        const res = await fetch(`https://next-api.telecrm.in/enterprise/${ENT}/autoupdatelead`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            fields: {
              phone: `91${phone}`,
              name: notes.name || undefined,
              course_payment: "Paid",
              course_amount: Number(order.amount) / 100,
              course_paid_on: Date.now(),
              razorpay_payment_id: paymentId,
            },
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) {
          console.error("[course-quiz verify] TeleCRM rejected:", res.status, (await res.text().catch(() => "")).slice(0, 200));
        }
      } catch (e) {
        /* The payment is real once the signature and order check pass, so the
           buyer is shown the confirmation regardless and the miss is logged. */
        console.error("[course-quiz verify] PAID but TeleCRM not updated:", orderId, paymentId, e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[course-quiz verify] error:", error);
    return NextResponse.json({ error: "Could not confirm the payment" }, { status: 500 });
  }
}