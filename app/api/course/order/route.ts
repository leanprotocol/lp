export const runtime = "nodejs";

/* Creates the Razorpay order for the master class. The amount comes from
   content/course.ts and is set here on the server. */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { COURSE } from "../../../../content/course";

const COURSE_ORDER_SOURCE = "course-masterclass";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string; phone?: string };
    const name = String(body.name || "").trim().slice(0, 100);
    const phone = String(body.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!name || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter your name and a valid 10-digit mobile number" }, { status: 400 });
    }
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });

    const order = await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.create({
      amount: COURSE.priceInr * 100,
      currency: "INR",
      receipt: `course_${Date.now()}`,
      notes: { source: COURSE_ORDER_SOURCE, name, phone },
    });
    return NextResponse.json({ success: true, orderId: order.id, amount: COURSE.priceInr, keyId });
  } catch (error) {
    console.error("[Course Order] error:", error);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}