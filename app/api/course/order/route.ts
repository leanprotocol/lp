export const runtime = "nodejs";

/* Called when someone clicks Pay. Two things, in parallel:
   1. records the lead in TeleCRM as "Checkout started" (lib/course-crm.ts),
      so an abandoned payment is still a lead;
   2. creates the Razorpay order. The amount comes from content/course.ts and
      is set here on the server.
   A slow or failing TeleCRM never blocks the payment. */

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { BONUS, COURSE } from "../../../../content/course";
import { validCoupon } from "../../../../lib/course-coupon";
import { recordCheckoutStarted, type Attribution } from "../../../../lib/course-crm";

const COURSE_ORDER_SOURCE = "course-masterclass";

export async function POST(request: NextRequest) {
  let crm: Promise<boolean> | null = null;
  try {
    const body = (await request.json().catch(() => ({}))) as { name?: string; phone?: string; attribution?: Attribution; coupon?: string };
    const name = String(body.name || "").trim().slice(0, 100);
    const phone = String(body.phone || "").replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
    if (!name || !/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ error: "Please enter your name and a valid 10-digit mobile number" }, { status: 400 });
    }
    crm = recordCheckoutStarted(name, phone, body.attribution || {});

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) { await crm; return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 }); }

    const discounted = validCoupon(body.coupon);
    const amountInr = discounted ? COURSE.priceInr - BONUS.discountInr : COURSE.priceInr;
    const order = await new Razorpay({ key_id: keyId, key_secret: keySecret }).orders.create({
      amount: amountInr * 100,
      currency: "INR",
      receipt: `course_${Date.now()}`,
      notes: { source: COURSE_ORDER_SOURCE, name, phone, coupon: discounted ? BONUS.code : "" },
    });
    /* Give TeleCRM up to 3 s more; serverless functions stop when they respond. */
    await Promise.race([crm, new Promise((r) => setTimeout(r, 3000))]);
    return NextResponse.json({ success: true, orderId: order.id, amount: amountInr, keyId, couponApplied: discounted });
  } catch (error) {
    console.error("[Course Order] error:", error);
    if (crm) await Promise.race([crm, new Promise((r) => setTimeout(r, 3000))]); // keep the lead even if Razorpay failed
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
  }
}