import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const PRICE = 89; // rupees

export async function POST() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return NextResponse.json({ error: "Payment is not configured" }, { status: 500 });
  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: PRICE * 100,
      currency: "INR",
      receipt: "mc_" + Date.now(),
      notes: { product: "glp1-masterclass" },
    });
    return NextResponse.json({ keyId, currency: "INR", amount: PRICE, orderId: order.id });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Could not create order" }, { status: 500 });
  }
}
