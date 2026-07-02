import { NextResponse } from "next/server";
import crypto from "crypto";

/* Verifies a Razorpay payment signature for the Brides Edit funnel.
   Razorpay signs `${order_id}|${payment_id}` with your key secret (HMAC-SHA256);
   we recompute it and compare. If you also want to record the sale in your CRM
   or database, do it here after the signature check passes. */

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ success: false, error: "Payment is not configured" }, { status: 500 });
    }
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ success: false, error: "Missing payment details" }, { status: 400 });
    }

    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expected !== razorpaySignature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // ✅ Payment verified. (Optional) record the order / notify your team here.

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
