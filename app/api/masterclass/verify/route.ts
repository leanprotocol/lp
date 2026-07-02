import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, hashPassword, signToken, COOKIE, cookieOptions } from "../../../../lib/courseAuth";

/* On a verified ₹89 payment: create (or upgrade) the CourseUser as purchased,
   store their hashed password, and start a session. */

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, name, email, password } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return NextResponse.json({ success: false, error: "Payment is not configured" }, { status: 500 });
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature)
      return NextResponse.json({ success: false, error: "Missing payment details" }, { status: 400 });

    const expected = crypto.createHmac("sha256", secret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
    if (expected !== razorpaySignature) return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });

    const em = String(email || "").trim().toLowerCase();
    const pw = String(password || "");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return NextResponse.json({ success: false, error: "Please enter a valid email" }, { status: 400 });
    if (pw.length < 6) return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });

    const hash = await hashPassword(pw);
    const user = await prisma.courseUser.upsert({
      where: { email: em },
      create: { email: em, password: hash, name: name ? String(name).trim() : null, purchased: true, razorpayOrderId, razorpayPaymentId },
      // returning buyer: mark purchased, keep their existing password
      update: { purchased: true, razorpayOrderId, razorpayPaymentId, ...(name ? { name: String(name).trim() } : {}) },
    });

    const token = signToken(user.id);
    const res = NextResponse.json({
      success: true,
      user: { email: user.email, name: user.name, purchased: true, activeModule: user.activeModule, completed: user.completed },
    });
    res.cookies.set(COOKIE, token, cookieOptions);
    return res;
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : "Verification failed" }, { status: 500 });
  }
}
