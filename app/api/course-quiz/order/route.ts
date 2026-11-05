export const runtime = "nodejs";

/* Creates the Rs 49 Razorpay order for the quiz funnel.
 *
 * The amount comes from content/course-quiz.ts and is set here, on the
 * server, so nothing the browser sends can change it. The lead was already
 * written by /api/course-quiz/lead before this is called, so an abandoned
 * payment is still a lead.
 *
 * Deliberately separate from /api/course/order, which sells the same master
 * class at Rs 99 and verifies against that number.
 */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { QUIZ_PRICE_INR, QUIZ_ORDER_SOURCE } from "@/content/course-quiz";

export async function POST(request: NextRequest) {
  try {
    const b = (await request.json().catch(() => ({}))) as { name?: string; phone?: string };
    const name = String(b.name || "").trim().slice(0, 100);
    const phone = String(b.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!name || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter your name and a valid 10-digit mobile number" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const order = await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.create({
      amount: QUIZ_PRICE_INR * 100,
      currency: "INR",
      receipt: `cq_${Date.now()}`,
      notes: { source: QUIZ_ORDER_SOURCE, name, phone },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: QUIZ_PRICE_INR,
      currency: "INR",
      keyId,
    });
  } catch (error) {
    console.error("[course-quiz order] error:", error);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}