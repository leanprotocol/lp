export const runtime = "nodejs";

/* Creates the Razorpay order for the senior-health-coach call that follows
   the /users lead form. The amount comes from content/users-next.ts and is
   set here, on the server - nothing the browser sends can change it.
   Modelled on consult49/create-order, kept separate so that page can be
   switched on or changed without touching this funnel. */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { COACH_AMOUNT_INR, COACH_ORDER_SOURCE } from "../../../../content/users-next";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string; phone?: string };
    const name = String(body.name || "").trim().slice(0, 100);
    const phone = String(body.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "A valid 10-digit mobile number is required" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: COACH_AMOUNT_INR * 100,
      currency: "INR",
      receipt: `coach_${Date.now()}`,
      notes: { source: COACH_ORDER_SOURCE, name, phone },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: COACH_AMOUNT_INR,
      currency: "INR",
      keyId,
    });
  } catch (error) {
    console.error("[Coach Order] create-order error:", error);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}