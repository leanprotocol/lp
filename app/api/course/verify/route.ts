export const runtime = "nodejs";

/* Verifies a master-class payment and records it in TeleCRM against the
   buyer's phone (creating the lead if new). The app unlocks the course for
   that phone number. Fields (create them in TeleCRM under Lead Fields):
   course_payment (dropdown: Paid), course_amount (number),
   course_paid_on (date), course_coupon (text),
   razorpay_payment_id (text, already exists). */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { BONUS, COURSE } from "../../../../content/course";

const SOURCE = "course-masterclass";
const ENT = process.env.TELECRM_ENTERPRISE_ID;
const TOKEN = process.env.TELECRM_API_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const b = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const orderId = String(b.razorpayOrderId || ""), paymentId = String(b.razorpayPaymentId || ""), signature = String(b.razorpaySignature || "");
    if (!orderId || !paymentId || !signature) return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    const keyId = process.env.RAZORPAY_KEY_ID, keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });

    const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    const x = Buffer.from(expected), y = Buffer.from(signature);
    if (x.length !== y.length || !crypto.timingSafeEqual(x, y)) return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });

    const order = (await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.fetch(orderId)) as unknown as { amount: number | string; notes?: Record<string, string> };
    const notes = order.notes || {};
    const allowed = [COURSE.priceInr, COURSE.priceInr - BONUS.discountInr].map((x) => x * 100);
    if (!allowed.includes(Number(order.amount)) || notes.source !== SOURCE) {
      return NextResponse.json({ error: "This payment does not match the master class" }, { status: 400 });
    }

    const phone = String(notes.phone || "").replace(/\D/g, "");
    if (phone && ENT && TOKEN) {
      try {
        const res = await fetch(`https://next-api.telecrm.in/enterprise/${ENT}/autoupdatelead`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({ fields: {
            phone: `91${phone}`, name: notes.name || undefined,
            course_payment: "Paid", course_amount: Number(order.amount) / 100, course_paid_on: Date.now(), razorpay_payment_id: paymentId,
            course_coupon: notes.coupon || undefined,
          } }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) console.error("[Course Verify] TeleCRM rejected:", res.status, (await res.text().catch(() => "")).slice(0, 200));
      } catch (e) { console.error("[Course Verify] PAID but TeleCRM not updated:", orderId, paymentId, phone, e); }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Course Verify] error:", error);
    return NextResponse.json({ error: "Could not confirm the payment" }, { status: 500 });
  }
}