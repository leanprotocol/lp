import { NextResponse } from "next/server";
import Razorpay from "razorpay";

/* Order endpoint for the Brides Edit funnel — the Bridal Doctor Consultation.
   Fixed price, computed server-side (never trusted from the browser). */

const CONSULT_PRICE = 449; // rupees

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Payment is not configured" }, { status: 500 });
  }
  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: CONSULT_PRICE * 100, // paise
      currency: "INR",
      receipt: "brides_consult_" + Date.now(),
      notes: { product: "brides-consultation", campaign: "brides-edit" },
    });
    // returns rupees in `amount`; the client multiplies by 100 for the checkout modal
    return NextResponse.json({ keyId, currency: "INR", amount: CONSULT_PRICE, orderId: order.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
